from dotenv import load_dotenv
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_tavily import TavilySearch
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3
from langgraph.types import Command, interrupt
from langchain_core.tools import tool
import sys
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

# memory

config = {"configurable": {"thread_id": "1"}}

checkpointer = MemorySaver()
# checkpointer = SqliteSaver(conn=sqlite3.connect("agente.db", check_same_thread=False))

# tools

@tool
def human_assistance(query: str) -> str:
    """Request assistance from a human."""
    human_response = interrupt({"query": query})
    return human_response["data"]

@tool
def linkedin_search(search_terms: str) -> str:
    """
    Search for LinkedIn profiles using specific industry terms, job titles, or company types.
    
    Args:
        search_terms: Specific keywords, job titles, industries, or company types to search for
                     (e.g., "restaurant industry CEO", "pet services entrepreneur", "fintech startup founder")
    """
    tavily = TavilySearch(max_results=5)
    
    # Search for both individual profiles and companies
    linkedin_query = f"site:linkedin.com/in {search_terms} OR site:linkedin.com/company {search_terms}"
    
    try:
        # Get results from Tavily
        search_results = tavily.run(linkedin_query)
        
        # Handle different response formats from Tavily
        if isinstance(search_results, str):
            # If Tavily returns a string, parse it or return as is
            return f"LinkedIn search results for '{search_terms}':\n\n{search_results}"
        
        if isinstance(search_results, list):
            results = search_results
        elif isinstance(search_results, dict) and 'results' in search_results:
            results = search_results['results']
        else:
            return f"Unexpected response format from search for: {search_terms}"
        
        if not results:
            return f"No LinkedIn profiles found for: {search_terms}"
        
        formatted_results = f"LinkedIn profiles found for '{search_terms}':\n\n"
        
        # Process up to 5 results
        for i, result in enumerate(results[:5], 1):
            if isinstance(result, dict):
                url = result.get('url', 'No URL')
                title = result.get('title', 'No title')
                content = result.get('content', result.get('snippet', 'No description available'))
            else:
                # If result is not a dict, convert to string
                url = 'No URL'
                title = f'Result {i}'
                content = str(result)
            
            # Clean up the content to make it more readable
            content_preview = content[:200] + "..." if len(content) > 200 else content
            
            formatted_results += f"{i}. **{title}**\n"
            formatted_results += f"   URL: {url}\n"
            formatted_results += f"   Description: {content_preview}\n\n"
        
        return formatted_results
        
    except Exception as e:
        return f"Error searching LinkedIn profiles: {str(e)}"

tools = [
    human_assistance,
    linkedin_search,
]

# llm

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.3, 
    max_tokens=1000,
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()]
)

llm_with_tools = llm.bind_tools(tools)

# graph

class State(TypedDict):
    messages: Annotated[list, add_messages]

def agent1(state: State):
    system_prompt = """
        You are an agent specialized in validating business ideas. Your task is:
        1. Receive a business idea from the user
        2. Analyze the idea to identify industries, roles, and types of companies relevant for validating the idea (they should be potential customers)

        When you receive a business idea:

        STEP 1: Analyze the business idea and identify:
        - What industries are potential customers?
        - What roles/positions are potential customers?
        - What types of companies are potential customers?
        - What specific expertise would be valuable for validating the idea?

        STEP 2: Form specific and targeted search queries for LinkedIn:
        - Instead of searching for the complete idea, search for specific terms like:
          * "restaurant industry CEO" 
          * "pet services entrepreneur"
          * "fintech startup founder"
          * "healthcare technology director"
        
        Do not use any tools, just respond with the information you have found.
    """
    conversation = [
        SystemMessage(content=system_prompt),
        *state["messages"]
    ]
    return {"messages": [llm_with_tools.invoke(conversation)]}

def agent2(state: State):
    system_prompt = """
        You are an agent specialized in validating business ideas. Your task is:
        1. Receive specific LinkedIn search queries to validate a business idea
        2. Search for strategic LinkedIn profiles that can help validate the idea
        3. Return the search results

        When you receive a specific LinkedIn search query:

        STEP 1: Use linkedin_search with the specific terms you identified

        STEP 2: For each profile found, create a personalized introduction message tailored to the profile's industry, position, and company, as well as a list of 3 questions that can be asked to validate the idea.

        Example:
        Business idea: "An app that helps find pet-friendly restaurants"
        Search: "restaurant industry executives" (not "An app that helps find pet-friendly restaurants")
        Result:
        - Profile 1: "John Doe, CEO of Pet Friendly Restaurants"
            - Introduction message: "Hi John, my name is [Your name] and I am [Your role]. I'm working on a startup that seeks to validate the idea of an app that helps find pet-friendly restaurants. Would you like to know more about the app and how it could help you?"
            - List of 3 questions:
            * What do you think about the idea of an app that helps find pet-friendly restaurants?
            * What challenges do you currently face in attracting pet owners to your restaurant?
            * Would you be willing to partner with such an app or pay for listings?
        - Profile 2: "Jane Smith, Founder of Pet Services"
            - Introduction message: "Hi Jane, my name is [Your name] and I am [Your role]. I'm working on a startup that seeks to validate the idea of an app that helps find pet-friendly restaurants. Would you like to know more about the app and how it could help you?"
            - List of 3 questions:
            * What do you think about the idea of an app that helps find pet-friendly restaurants?
            * How do your customers currently find pet-friendly dining options?
            * Would your business benefit from recommending such restaurants to your clients?
        Be proactive and execute the necessary tools without waiting for confirmation.
    """
    conversation = [
        SystemMessage(content=system_prompt),
        *state["messages"]
    ]
    return {"messages": [llm_with_tools.invoke(conversation)]}

tool_node = ToolNode(tools=tools)

graph_builder = StateGraph(State)
graph_builder.add_edge(START, "agent1")
graph_builder.add_node("agent1", agent1)
graph_builder.add_node("agent2", agent2)
graph_builder.add_edge("agent1", "agent2")
graph_builder.add_node("tools", tool_node)
graph_builder.add_conditional_edges("agent2", tools_condition)
graph_builder.add_edge("tools", "agent2")
graph = graph_builder.compile(checkpointer=checkpointer)
with open("graph.png", "wb") as f:
    f.write(graph.get_graph().draw_mermaid_png())

# execution

while True:
    business_idea = input("💡 Business Idea: ")
    if business_idea.lower() in ["quit", "exit", "q"]:
        print("Goodbye! 👋")
        break
    events = graph.stream(
        {"messages": [{"role": "user", "content": business_idea}]},
        config, # to follow a conversation thread
        stream_mode="values",
    )
    for event in events:
        if "messages" in event:
            event["messages"][-1].pretty_print()
    # Check if we need human input for a tool
    while True:
        snapshot = graph.get_state(config)
        if snapshot.next and snapshot.next[0] == 'tools':
            # Tool is waiting for human input
            human_response = input("Human: ")
            if human_response.lower() in ["quit", "exit", "q"]:
                print("Goodbye!")
                sys.exit(0)
            # Resume the tool execution with human response
            human_command = Command(resume={"data": human_response})
            events = graph.stream(human_command, config, stream_mode="values")
            # Process the response after human input
            for event in events:
                if "messages" in event:
                    event["messages"][-1].pretty_print()
        else:
            # No more tools waiting, break out of the inner loop
            break