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

### PLAN (7-15 minutes)
```markdown
## Planning Phase
- [ ] Load project context files (.cursorrules, CLAUDE.md, etc.)
- [ ] Review coding standards and architectural patterns
- [ ] Create detailed execution strategy with explicit checkpoints
- [ ] Set up AI with project-specific instructions
- [ ] Define human-AI role assignments (driver/navigator)

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
## Implementation Phase
Checkpoint intervals: Every 30 minutes for long sessions

Active Development Pattern:
1. Generate code in incremental chunks (50-100 lines)
2. Review and validate each chunk before proceeding
3. Maintain human oversight of business logic decisions
4. Document AI reasoning for complex implementations
5. Run tests continuously, not just at session end

Quality Check Questions:
- Does this code follow our established patterns?
- Are security considerations properly addressed?
- Is the implementation testable and maintainable?
- Do I understand what this code does and why?
```

### CHECK (2-5 minutes per checkpoint)
```markdown
## Validation Phase
- [ ] Code functionality matches requirements
- [ ] Security patterns properly implemented  
- [ ] Performance considerations addressed
- [ ] Test coverage adequate
- [ ] Documentation updated as needed
- [ ] No obvious bugs or edge cases missed
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