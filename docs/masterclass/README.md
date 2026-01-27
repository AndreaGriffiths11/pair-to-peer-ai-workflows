# Masterclass - Building AI Agents with Python

> **Attribution:** This content has been adapted and translated from the original Spanish masterclass by Juan Sensio at [https://github.com/juansensio/masterclass_agentes](https://github.com/juansensio/masterclass_agentes)

This repository contains the code that accompanies the masterclass on building AI agents with Python.

- [01 - Introduction](./01_intro.ipynb): Implements a basic chatbot.
- [02 - Tools](./02_herramientas.ipynb): Improves the chatbot with the use of tools to convert it into an agent.
- [03 - Memory](./03_memoria.ipynb): Implements memory in the agent so it remembers past conversations.
- [04 - HIL](./04_hil.ipynb): Implements *human-in-the-loop* in the agent so it can request extra inputs from the user during the conversation.
- [05 - Research Agent](./agente.py): Applies everything learned in the development of a search agent for business idea validation.

## Want to Learn More?

- FREE tutorials on my blog (https://www.juansensio.com/blog) and Youtube (https://www.youtube.com/@juansensio)
- Online course: El Curso de IA (https://www.elcursodeia.com/)
    -   Introduction to Computing with Python (FREE)
    -   Data Analysis with Python (FREE)
    -   Machine Learning with Scikit-Learn
    -   Deep Learning with Pytorch
    -   And much more...
- Book: Introduction to Artificial Intelligence with Python (https://savvily.es/libros/introduccion-a-la-inteligencia-artificial-con-python/)
- Join the Discord community (https://discord.gg/aTeEKXzKbs) 
- Follow me on social media (https://x.com/juansensio; https://linkedin.com/in/juanbpedro)


## Requirements

Install `uv` for your operating system by following the instructions at https://docs.astral.sh/uv/getting-started/installation/.

Then, install the project dependencies with:

```bash
uv sync
```

If you're starting a new project from scratch, you'll first need to create the virtual environment with:

```bash
uv init
```

Then, you can install dependencies with `uv add <package_name>`, for example:

```bash
uv add langgraph
```
