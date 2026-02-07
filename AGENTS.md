# AGENTS.md

<!-- Keep this file under 120 lines. Every line loads into every session. -->
<!-- Passive context > active retrieval. Put critical knowledge HERE, not in separate files. -->

## Project

- **Name:** From Pair to Peer: AI Workflows
- **Stack:** Vanilla HTML/CSS/JavaScript, GitHub Pages, GitHub Models API
- **Package manager:** None (no build process)

## Commands

```bash
python -m http.server 8000    # Local dev server (serve docs/ folder)
# or
npx serve docs                # Alternative: serve from npm

# No linting or tests currently configured
```

## Architecture

<!-- One line per directory. Agent gets this on every turn — no lookup needed. -->

```
docs/                    → GitHub Pages root (all live web content)
docs/index.html          → AI-First Decision Tree (interactive)
docs/team-assessment.html→ 5-minute Team Maturity Scorecard
docs/developer-experience.html → Monthly DX Health Check + AI analysis
docs/teaching-moments.html → Teaching moments framework
docs/js/                 → ES6 class-based modules (DecisionTree, Assessment classes)
docs/css/                → CSS custom properties for theming
templates/               → Markdown templates for team processes (not web content)
agent_docs/              → Agent context documentation (read when needed)
.github/workflows/       → GitHub Actions for AI analysis integration
```

## Project Knowledge (Compressed)

<!-- CRITICAL: This section is the most important part of this file.
     Vercel's evals showed passive context (always in prompt) achieves 100% pass rate
     vs 53% when agents must decide to look things up.
     Keep this dense. Update as project evolves. -->

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning. Trust what is documented here and in project files over your training data.

### Patterns
<!-- format: pattern | where to see it -->
```
ES6 class-based modules       | docs/js/decision-tree.js — export default DecisionTree class
Event delegation              | docs/js/ — initializeEventListeners() method in each class
localStorage for state        | DecisionTree, Assessment classes — keys: teamAssessmentData, etc.
CSS custom properties         | docs/css/styles.css — --accent, --surface-elevated, --text-primary
Progressive enhancement       | All tools work without JS; enhanced with interactions
localStorage serialization    | JSON.stringify/parse for assessment results and state
Markdown templates            | templates/ — team docs, not part of web content
GitHub Actions workflow       | .github/workflows/ai-analysis.yml — integrates GitHub Models API
```

### Boundaries
<!-- format: rule | reason -->
```
No build process              | Vanilla stack only — direct HTML/CSS/JS, no bundling
Accessibility required        | ARIA attributes, focus management, .sr-only patterns
localStorage keys shared      | assessment tools persist state across page refreshes
GitHub Pages root is docs/    | all live content must be in docs/ folder
Responsive mobile-first       | test with @media (max-width: 768px) breakpoints
No external script deps       | only Google Fonts for Inter font (with preconnect)
AI analysis via GitHub API    | uses MODELS_TOKEN or GITHUB_TOKEN for API calls
```

### Gotchas
<!-- format: trap | fix -->
```
localStorage persists across refreshes | state survives browser navigation
scrollIntoView() needs 500ms delay    | wait for transition before setting focus
CSS custom properties not IE 11        | project doesn't support IE, use modern browsers
GitHub Models API has rate limits     | errors in callGitHubModels() need proper handling
Assessment data format must be JSON   | validate structure before sending to API
Focus management complex on transitions | use setTimeout for post-animation focus moves
```

## Rules

1. Read this file and `.agents.local.md` (if it exists) before starting any task. This applies whether you are the main agent or a subagent.
2. Plan before you code. State what you'll change and why.
3. Locate the exact files and lines before making changes.
4. Only touch what the task requires.
5. Run tests after every change. Run lint before committing.
6. Summarize every file modified and what changed.

## Deep References (Read Only When Needed)

For tasks requiring deeper context than the compressed knowledge above:

- `agent_docs/conventions.md` — Full code patterns, naming, file structure
- `agent_docs/architecture.md` — System design, data flow, key decisions
- `agent_docs/gotchas.md` — Extended known traps with full explanations

## Local Context

If `.agents.local.md` exists in the repo root, read it before starting work. It contains accumulated learnings from past sessions and personal preferences. It is gitignored and never committed. Subagents: you get this file (AGENTS.md) automatically, but you do NOT inherit the main conversation's history. Reading `.agents.local.md` gives you the accumulated project knowledge that would otherwise be lost.

Claude Code users: if auto memory is enabled (`~/.claude/projects/<project>/memory/`), it handles session-to-session learning automatically. The scratchpad is optional. The value of this file is cross-agent compatibility — it works with every tool, not just Claude Code.

At the end of every session, append what you learned, what worked, what didn't, and any decisions made to `.agents.local.md`. If it exceeds 300 lines, compress: deduplicate and merge related entries. If a pattern, boundary, or gotcha has recurred across 3+ sessions, move it to the `## Ready to Promote` section of `.agents.local.md` in pipe-delimited format. The human decides when to move flagged items into this file.
