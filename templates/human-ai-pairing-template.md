# Human-AI Pairing Session Template

## Session Planning (5 minutes)

**Pre-Session Checklist:**
```markdown
□ Session Goal: [Specific, measurable objective]
□ Duration: [30 min/1-2 hours/3+ hours]  
□ Context Files: Load 3-5 relevant files for AI context
□ Quality Gates: Define acceptance criteria
□ AI Tool Setup: Configure model, temperature, instructions
□ Success Metrics: How to measure session effectiveness
```

## Session Structure: PDCA Framework

### PLAN (7-15 minutes) - SpecKit Structure
```markdown
## SPECIFY Phase (2-3 minutes)
- [ ] Constitutional compliance check (security, architecture, quality principles)
- [ ] Define clear success criteria and acceptance tests
- [ ] Document any non-negotiable constraints or requirements

## PLAN Phase (5-12 minutes)
- [ ] Load project context files (.cursorrules, CLAUDE.md, etc.)
- [ ] Review coding standards and architectural patterns
- [ ] Create detailed execution strategy with explicit checkpoints
- [ ] Set up AI with project-specific instructions
- [ ] Define human-AI role assignments (driver/navigator)
- [ ] Create feature branch for experimentation

Context Template:
```
Project: [Name]
Task: [Specific requirement]
Architecture: [Stack, patterns, constraints]
Standards: [Coding conventions, style guides]
Quality Requirements: [Testing, performance, security]
```

### DO (30 minutes - 2.5 hours)
```markdown
## TASKS Phase (Incremental Implementation)
Checkpoint intervals: Every 30 minutes for long sessions

Specification-Driven Development Pattern:
1. Break features into specification-backed tasks
2. Generate code in incremental chunks (50-100 lines)
3. Validate against specification after each chunk
4. Review and validate each chunk before proceeding
5. Maintain human oversight of business logic decisions
6. Document AI reasoning for complex implementations
7. Run tests continuously, not just at session end
8. Keep reusable context for similar future tasks

Quality Check Questions:
- Does this code follow our established patterns?
- Are security considerations properly addressed?
- Is the implementation testable and maintainable?
- Do I understand what this code does and why?
```

### CHECK (2-5 minutes per checkpoint)
```markdown
## Validation Phase - Constitutional Compliance
- [ ] **Specification Alignment**: Code functionality matches requirements and specifications
- [ ] **Constitutional Security**: Security patterns properly implemented per team principles
- [ ] **Performance**: Performance considerations addressed
- [ ] **Quality Standards**: Test coverage meets constitutional minimums (80%)
- [ ] **Knowledge Transfer**: Documentation updated, AI reasoning captured
- [ ] **Transparency**: No obvious bugs or edge cases missed
- [ ] **Reusable Context**: Patterns documented for future similar tasks
```

### ACT (5-10 minutes)
```markdown
## Retrospective Phase
What worked well this session:
- [AI collaboration patterns that were effective]
- [Prompt strategies that yielded good results]
- [Context management approaches that helped]

What could be improved:
- [Areas where AI guidance was insufficient]
- [Prompts that needed multiple iterations]
- [Context issues that slowed progress]

Action items for next session:
- [Specific improvements to implement]
- [Updated context files or instructions needed]
- [Skills to develop or research to conduct]
```

## Context Management Strategy

**File Context Hierarchy:**
1. **Project Level**: Keep project README, architecture docs open
2. **Module Level**: Related components and interfaces  
3. **Function Level**: Current working area and dependencies

**Context Reset Triggers:**
- AI suggestions become irrelevant or contradictory
- Session duration exceeds 2-3 hours
- Context window approaching limits (>75% full)
- Quality of suggestions noticeably degrading

**Checkpoint System:**
```markdown
Save checkpoint when:
- [ ] Major feature component completed
- [ ] Before significant architectural changes  
- [ ] At natural development phase transitions
- [ ] After successful complex implementation

Checkpoint naming: "v0.1-[feature-name]-[status]"
Example: "v0.1-user-auth-complete"
```

## Agent Delegation Sessions (Async)
- Scope tasks with **clear acceptance criteria, blast-radius limits, and rollback plan**.
- Decide **Edit Mode vs. Agent Mode vs. Cloud Delegation**:
  - Edit Mode: collaborative pairing, ambiguous requirements, exploratory work.
  - Agent Mode (IDE/CLI): you stay in the loop, approve tool calls, strong tests/context.
  - Cloud delegation (Copilot cloud agent or a Copilot app cloud session): background execution, repeatable tasks, you review the PR.
- Prep context: `AGENTS.md`, relevant `SKILL.md` skills, test commands, MCP server list + scopes.
- Pick the model and reasoning effort for the task; higher effort for debugging and architecture, lower for routine work.
- Run agent in bounded chunks; log prompts, actions, and artifacts (session link, hooks output).
- Schedule human review window; require PR surfaced with agent change log and self-review.

## Parallel Sessions (Copilot App / CLI `/fleet`)
- One task per session, one session per worktree. Never point two agents at the same working tree.
- Start sessions from an issue or PR so **My Work** keeps the thread; steer on the canvas instead of re-prompting.
- Cap concurrency to what you can review the same day (2-4 sessions for most people).
- Before Agent Merge touches a PR, decide its conditions: fix CI only, respond to reviews, or merge.
- Ask **Rubber Duck** (different model family) for a second opinion on any plan or diff you cannot verify quickly yourself.
- Close the loop: retro which sessions needed re-prompting and update `AGENTS.md` or a skill so the next run needs less.

## Agent-Authored PR Checkpoints
- [ ] Agent scope respected (no unexpected files/secrets/infra changes)
- [ ] Tests updated/executed; blast radius documented
- [ ] MCP calls/tools noted; permissions match policy
- [ ] Agent self-review and security review ran; Rubber Duck findings addressed for non-trivial diffs
- [ ] Quality gates applied (security, performance, accessibility as applicable)
- [ ] Agent Merge conditions respected (no auto-merge on protected paths)
- [ ] Rollback path documented; owner accountable for merge
