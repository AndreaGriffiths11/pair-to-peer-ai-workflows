# Architecture

## System Overview

Static site hosted on GitHub Pages. No backend, no database, no build process. Pure HTML/CSS/JavaScript with client-side state persisted to localStorage.

**Four interactive assessment tools** on separate pages:
1. **Decision Tree** (`index.html`) — AI vs Human-first choices (interactive decision logic)
2. **Team Assessment** (`team-assessment.html`) — 5-minute maturity scorecard (localStorage state)
3. **Developer Experience** (`developer-experience.html`) — Monthly health check + AI analysis (GitHub Models API)
4. **Teaching Moments** (`teaching-moments.html`) — Learning experience capture

## Data Flow

```
Browser (User Input)
    ↓
JavaScript Classes (State Management)
    ↓
localStorage (Persistent State)
    ↓
(Optional) GitHub Actions + GitHub Models API (AI Analysis)
```

**Assessment tool lifecycle:**
1. User opens HTML page
2. JS class initializes, checks localStorage for existing responses
3. If found, populate form with saved state
4. On response change, update both DOM and localStorage
5. On completion, calculate scores and show results
6. Optional: trigger GitHub Actions workflow for AI-powered analysis

**AI Analysis Flow (Developer Experience tool):**
```
1. User completes survey
2. "Generate AI Insights" button visible
3. Opens GitHub Actions UI (manual trigger)
4. User copies survey JSON from tool
5. Pastes into workflow input
6. Workflow calls GitHub Models API (GPT-4o-mini)
7. Results returned as downloadable artifact
```

## File Structure

```
docs/                           — GitHub Pages root
├── index.html                  — AI-First Decision Tree
├── team-assessment.html        — Team Maturity Assessment
├── developer-experience.html   — DX Health Check + AI analysis
├── teaching-moments.html       — Teaching moments framework
├── css/
│   ├── main.css                — Base typography, layout, colors
│   ├── modern-theme.css        — Color scheme (CSS custom props)
│   ├── interactive-components.css — Buttons, cards, inputs
│   ├── decision-tree.css       — Decision tree specific
│   └── team-assessment.css     — Assessment specific
├── js/
│   ├── navigation.js           — Mobile menu, scroll behavior (shared)
│   └── slides.js               — Slide navigation (for slides.html)
└── results/                    — Empty folder for generated analysis

.github/workflows/
└── ai-analysis.yml             — GitHub Models API integration
```

## Key Design Decisions

### No Build Process
- All code loaded as-is from `docs/`
- CSS in `<link>` tags (no SCSS compilation)
- JavaScript inline in `<script>` tags (no bundling)
- Benefit: single source of truth, instant updates on GitHub Pages, zero deploy friction

### localStorage for State
- Assessment responses stored as JSON strings
- Survives page refresh and browser restart
- Tools check localStorage on init and restore form state
- Clear mechanism: user action in UI triggers `localStorage.removeItem()`

### Class-Based JavaScript
- Each tool is a class (e.g., `class TeamAssessment { }`)
- Single-responsibility: handle one page's interactivity
- Constructor takes container selector, caches DOM elements
- All listeners attached in dedicated `initializeEventListeners()` method
- Benefit: testable, reusable, explicit initialization

### GitHub Pages + GitHub Actions
- Main site is static (served from `docs/`)
- AI analysis opt-in: user manually triggers workflow
- Workflow receives survey data as JSON input
- Uses GitHub Models API (no external API keys needed for authenticated repos)
- Results stored as artifacts (download link provided in tool)

### Accessibility First
- ARIA labels on all interactive elements
- Focus trap in modals/menus
- Screen reader text (`.sr-only` class)
- Keyboard navigation (Tab, Enter, Escape)
- Color contrast 4.5:1 minimum
- Semantic HTML (`<button>` not `<div>` with click handler)

## External Dependencies

- **Google Fonts:** Inter font family (preconnected for performance)
- **GitHub Pages:** Static hosting + GitHub Actions runner
- **GitHub Models API:** Optional AI analysis (authenticated via GITHUB_TOKEN or MODELS_TOKEN)
- **No npm packages:** Vanilla JavaScript only

## Deployment Pipeline

1. **Local development:** `python -m http.server 8000` (or `npx serve docs`)
2. **Push to main:** GitHub automatically serves `docs/` folder
3. **AI analysis workflow:** User manually triggers via GitHub Actions UI
4. **Results:** Stored as artifact, downloadable from workflow run

## Performance Considerations

- **No external scripts:** Instant load (font preconnect minimizes CLS)
- **localStorage caching:** Form state restores instantly
- **CSS custom properties:** Efficient theming without re-downloading files
- **Event delegation:** Single listener per tool, not per element
- **Lazy rendering:** Only render visible DOM nodes (scrollIntoView for navigation)
