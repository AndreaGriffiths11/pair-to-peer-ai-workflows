# AI-First Draft Decision Tree

## When to Use AI for Initial Code Generation

```
START: New Development Task
├─ Constitutional Check: Does this violate team principles?
│  ├─ YES → [HUMAN-FIRST] Enhanced review required
│  └─ NO → Continue to task assessment
├─ Is this a well-defined task with existing patterns?
│  ├─ NO → Is it novel/complex requiring new architectural decisions?
│  │  ├─ YES → [HUMAN-FIRST] Start from scratch with AI assistance for research
│  │  └─ NO → [MIXED APPROACH] Use AI for exploration, human for structure
│  └─ YES → Does it involve sensitive data or security-critical functions?
│     ├─ YES → Use local AI models OR enhanced security review process
│     └─ NO → [AI-FIRST] High suitability for AI generation
│
└─ Task Assessment:
   ├─ Agent suitability? (clear criteria, low blast radius, AGENTS.md + tests, MCP tools on the allowlist)
   │   ├─ YES → **AGENT-DELEGATED** (Copilot cloud agent, Copilot app session, or CLI /fleet)
   │   └─ NO → Continue
   ├─ Task Complexity:
   │   ├─ Simple/Repetitive (boilerplate, CRUD, tests) → AI-FIRST
   │   ├─ Medium (business logic, integrations) → AI-ASSISTED  
   │   └─ Complex (architecture, novel algorithms) → HUMAN-FIRST
```

## Decision Criteria Matrix

| Factor | AI-First | AI-Assisted | Agent-Delegated | Human-First |
|--------|----------|-------------|-----------------|-------------|
| **Code Complexity** | Simple patterns, boilerplate | Standard business logic | Repetitive tasks with clear acceptance | Novel algorithms, complex architecture |
| **Security Risk** | Low (UI, docs, tests) | Medium (business logic) | Guarded scopes, low blast radius | High (auth, payments, crypto) |
| **Team Experience** | Senior devs who can review | Mixed experience teams | Confident in reviewing agent output | Junior devs learning concepts |
| **Context Available** | Similar code exists in codebase | Some existing patterns | AGENTS.md + skills + tests ready for agent | No precedent or patterns |
| **Time Constraints** | Tight deadlines, standard work | Balanced delivery timeline | Async via Copilot app session, cloud agent, or CLI /fleet | Learning/exploration priority |
| **Agent Autonomy Risk** | N/A | Low autonomy with supervision | Scoped autonomy, sandbox policy, kill-switches | Requires real-time human judgment |
| **MCP Integration** | Optional | Helpful | MCP servers on the enterprise allowlist | Not applicable |
| **Tooling** | Copilot completions, next edit suggestions | Copilot chat, agent mode, Spaces | Copilot app sessions, cloud agent, CLI /fleet, custom agents | IDE + manual workflows |
| **Verification** | Tests + Copilot code review | Rubber Duck second opinion + human review | Agent self-review, security review, Agent Merge conditions | Pair review + design review |

## Risk Assessment Checklist

**Constitutional Compliance Check:**
- [ ] **Security**: Does this touch auth, payments, or sensitive data? (If yes, human-first + security review)
- [ ] **Architecture**: Is this following documented patterns? (If no, architect approval needed)
- [ ] **Quality**: Can we achieve 80% test coverage? (If no, adjust scope or approach)
- [ ] **Knowledge**: Will team understand this implementation? (If no, documentation required)
- [ ] **Transparency**: Are AI contributions clearly trackable? (Always required)

**Before Using AI Generation:**
- [ ] Is this code handling sensitive data? (If yes, use local models or enhanced review)
- [ ] Does this involve authentication/authorization? (If yes, require security team review)
- [ ] Is this a novel pattern for our codebase? (If yes, human-first approach)
- [ ] Do we have existing test coverage for similar functionality? (If no, add testing requirements)
- [ ] Will this code be modified frequently? (If yes, ensure human understanding)

**Agent-Delegated Acceptance (Copilot cloud agent, Copilot app, or CLI):**
- [ ] Clear success criteria and rollback plan
- [ ] Blast radius bounded (scoped repo/actions, no secrets, sandbox policy applied)
- [ ] Session isolated in its own worktree or cloud environment (Copilot app / `/worktree`)
- [ ] Context ready: `AGENTS.md`, relevant `SKILL.md` skills, MCP servers on the allowlist
- [ ] Model and reasoning effort chosen for the task (higher effort for debugging/architecture, lower for routine work)
- [ ] Agent self-review and `/security-review` (or app security review) run before the PR opens
- [ ] Human checkpoint on PR with agent-authored change log; Rubber Duck second opinion for non-trivial diffs
- [ ] Agent Merge conditions decided up front (fix CI only? respond to reviews? merge?) — default to "fix CI, do not merge"
- [ ] Telemetry/alerts for long-running or autonomous actions (hooks with trace context, session logs)

## Quality Thresholds by Scenario

**New Features:**
- Standard features (auth forms, CRUD): AI acceptance rate >40%
- Business-specific features: AI acceptance rate >25%
- Novel features: AI acceptance rate >15%

**Bug Fixes:**
- Syntax/logic errors: AI-first with automated testing
- Integration issues: AI-assisted with manual validation
- Security vulnerabilities: Human-first with AI research assistance

**Refactoring:**
- Code restructuring without behavior change: AI-first
- Performance optimizations: AI-assisted with benchmarking
- Architectural changes: Human-first with AI pattern research
