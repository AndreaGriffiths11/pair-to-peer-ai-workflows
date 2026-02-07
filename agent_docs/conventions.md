# Code Conventions

## HTML Structure

- **Semantic HTML:** Use `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` for meaningful page structure.
- **ARIA attributes:** Always include `aria-label`, `aria-describedby`, `role`, `aria-live` for interactive elements.
- **Inline scripts:** Script tags at bottom of body. No external script deps except Google Fonts (with preconnect).
- **Meta tags:** OpenGraph, CSP headers, description, keywords in `<head>` for SEO.
- **Progressive enhancement:** All tools function without JavaScript; JS enhances with interactivity and state.

Example: see `docs/team-assessment.html` — proper nav structure, ARIA labels on buttons, fallback text.

## CSS Structure

- **CSS custom properties:** Define theme in `:root` (see `docs/css/main.css`). All colors, spacing, shadows use vars.
- **Mobile-first:** Base styles for mobile. Use `@media (max-width: 768px)` for desktop adjustments.
- **Component classes:** Reusable classes like `.btn-primary`, `.card`, `.score-dashboard` shared across tools.
- **No inline styles:** Never use `style="..."` in HTML. All styling via CSS classes.
- **Accessibility classes:** `.sr-only` for screen reader text. Maintain color contrast ratios (4.5:1 minimum).

Key theme variables:
```css
--primary-color, --text-primary, --text-secondary, --surface, --surface-elevated
--border-color, --success-color, --warning-color, --danger-color, --shadow
```

## JavaScript Patterns

- **Class-based modules:** Each tool is a class (e.g., `Navigation`, `Assessment`, `DecisionTree`).
- **Constructor + init():** Constructor calls `this.init()`. All setup happens in `init()`, not constructor.
- **Event listeners in initializeEventListeners():** Dedicated method that attaches all listeners. Called from `init()`.
- **Data attributes:** Use `data-*` attributes to track state in DOM (e.g., `data-selected="true"`).
- **DOM queries before listeners:** Cache frequently used DOM elements in `init()`.

```javascript
class MyTool {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.updateUI();
  }

  initializeEventListeners() {
    this.container.addEventListener('click', (e) => this.handleClick(e));
  }
}
```

## localStorage Keys

- **Naming:** camelCase, descriptive (e.g., `teamAssessmentData`, `decisionTreeResults`, `developerExperienceSummary`).
- **Structure:** Always store as JSON string. Parse on retrieval.
- **Lifetime:** Data persists across page refreshes. Clear on user action or 30-day expiry.
- **Size:** Keep under 5MB per domain. One tool's state should not exceed 100KB.

Example:
```javascript
const data = { responses: {...}, timestamp: new Date().toISOString() };
localStorage.setItem('teamAssessmentData', JSON.stringify(data));
```

## Naming Conventions

- **File names:** kebab-case (e.g., `decision-tree.js`, `team-assessment.html`, `modern-theme.css`).
- **IDs in HTML:** kebab-case, unique per page (e.g., `scoreDashboard`, `welcomeSection`).
- **Classes in HTML:** kebab-case, reusable (e.g., `btn-primary`, `card`, `score-dashboard`).
- **JS functions:** camelCase, verb-first (e.g., `initializeEventListeners()`, `calculateScore()`, `handleClick()`).
- **JS variables:** camelCase (e.g., `scoreData`, `isVisible`, `currentQuestion`).

## File Structure

- One interactive tool per HTML file in `docs/`.
- Inline CSS and JS in HTML (no external dependencies beyond fonts).
- Shared CSS in `docs/css/` (imported via `<link>`).
- No JS subdirectory needed if modules are inline; separate only for shared utilities.

Shared CSS files:
- `main.css` — Base typography, colors, layout
- `modern-theme.css` — Color scheme and spacing system
- `interactive-components.css` — Button, card, input styles
- `decision-tree.css`, `team-assessment.css` — Tool-specific overrides

## Testing & Validation

- **No test framework configured.** Manual browser testing via local server.
- **Accessibility:** Test with Axe browser extension. Check focus order (Tab key).
- **Responsive:** Test on mobile (max-width: 768px) before commit.
- **localStorage:** Open DevTools → Application → localStorage → verify key names and JSON structure.
