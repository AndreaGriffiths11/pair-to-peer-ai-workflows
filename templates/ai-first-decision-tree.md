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
└─ Task Complexity Assessment:
   ├─ Simple/Repetitive (boilerplate, CRUD, tests) → AI-FIRST
   ├─ Medium (business logic, integrations) → AI-ASSISTED  
   └─ Complex (architecture, novel algorithms) → HUMAN-FIRST
```

## Decision Criteria Matrix

| Factor | AI-First | AI-Assisted | Human-First |
|--------|----------|-------------|-------------|
| **Code Complexity** | Simple patterns, boilerplate | Standard business logic | Novel algorithms, complex architecture |
| **Security Risk** | Low (UI, docs, tests) | Medium (business logic) | High (auth, payments, crypto) |
| **Team Experience** | Senior devs who can review | Mixed experience teams | Junior devs learning concepts |
| **Context Available** | Similar code exists in codebase | Some existing patterns | No precedent or patterns |
| **Time Constraints** | Tight deadlines, standard work | Balanced delivery timeline | Learning/exploration priority |

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