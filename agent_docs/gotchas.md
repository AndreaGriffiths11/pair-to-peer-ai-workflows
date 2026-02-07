# Gotchas

<!-- Each entry: what looks right, what's actually wrong, and how to handle it. -->
<!-- Tested against the vanilla HTML/CSS/JS stack in this project. -->

## localStorage

- **localStorage persists across page refreshes and browser sessions.** If you don't explicitly clear it, stale data survives. Always provide a "Reset" button or clear on logout. Check DevTools → Application → localStorage to inspect and debug.
- **localStorage is synchronous and blocks rendering.** Parsing large JSON (>100KB) can cause jank. Keep assessment responses lean: extract only what's needed, remove redundant data, prune old responses.
- **localStorage is same-origin only.** `localhost:3000` and `localhost:8000` are different origins. Moving between dev ports = lost state. Use the same port during dev.
- **localStorage is cleared on "Clear browsing data" in user settings.** Assessments vanish without warning. Consider adding a "download as JSON" button so users can back up their responses.

## CSS Custom Properties (Theming)

- **CSS custom properties are inherited.** A var defined on `:root` cascades down. If you override it in a selector, child elements see the new value. Test dark mode and high contrast carefully.
- **Fallbacks don't work if var is undefined.** `color: var(--nonexistent, blue)` will be `blue`, but if the var exists and is invalid (empty, typo), the fallback is ignored. Always test theme switching.
- **@media queries can't read custom props.** You can't do `@media (max-width: var(--breakpoint))`. Use fixed pixel values in media queries; custom props work fine inside the rules.

Example of theme switching gotcha:
```javascript
// WRONG: This won't update colors in existing elements
document.documentElement.style.setProperty('--primary-color', '#ff0000');

// RIGHT: Add a class that redefines vars
document.documentElement.classList.add('dark-mode');
/* In CSS: */
.dark-mode { --primary-color: #1a1a1a; }
```

## Event Listeners & Memory Leaks

- **Event listeners added in a loop persist until explicitly removed.** If you re-init a tool without cleaning up old listeners, you'll attach duplicates. Always call `removeEventListener()` with the same function reference in a cleanup method.
- **`addEventListener('click', (e) => ...)` creates a new function each time.** Can't remove it later because you've lost the reference. Use named functions or cache the handler: `this.handleClick = (e) => {...}; el.addEventListener('click', this.handleClick)`.
- **Event delegation scales.** One listener on the container that checks `event.target` is better than listeners on each child. See `Navigation` class in `navigation.js` for the pattern.

## Focus Management & Transitions

- **`element.focus()` doesn't wait for CSS transitions.** If you focus immediately after showing an element with `display: none → block`, the browser hasn't laid out the element yet. Focus fails silently. Fix: `setTimeout(() => el.focus(), 500)` after transition.
- **`scrollIntoView()` disrupts smooth scroll if called before layout.** The page hasn't calculated positions yet. Same fix: delay with setTimeout.
- **Tab order follows DOM order, not CSS layout order.** If you `position: absolute` an element early in the DOM, it's still in tab order before later elements. Use `tabindex` carefully or reorder DOM elements to match visual flow.

Example from assessment tools:
```javascript
// Show modal with transition
this.modal.style.display = 'block';

// WRONG: Focus immediately
this.modal.querySelector('button').focus();

// RIGHT: Wait for layout
setTimeout(() => {
  this.modal.querySelector('button').focus();
}, 300); // Match CSS transition duration
```

## Form State Sync

- **Form input values and DOM state can diverge.** If you update `localStorage` but not `input.value`, or vice versa, the page reloads but inputs are empty. Always sync both: `input.value = data.response` AND `localStorage.setItem(...)`.
- **Checkbox state is tricky.** `checked` is a property, not an attribute. Use `input.checked = true`, not `input.setAttribute('checked', 'true')`. Same for radio buttons.
- **Date inputs have a specific format.** `<input type="date">` only accepts `YYYY-MM-DD`. If you store dates as ISO strings with timezone, strip the time part before setting `input.value`.

## Mobile Responsive Layout

- **`@media (max-width: 768px)` is tested, but not all devices.** 768px is the breakpoint, but some tablets are 800px wide. Test on actual devices or use Chrome DevTools device emulation.
- **Touch targets must be at least 44×44 pixels.** Buttons smaller than this are hard to tap. CSS `padding` helps: 1rem (16px) padding on a button = ~48×48 total touch target.
- **`position: fixed` breaks on mobile when keyboard is open.** Floating buttons disappear behind the keyboard on iOS. Use `position: sticky` or move to `position: relative` inside a scrollable container for mobile.

## HTML Semantics & ARIA

- **`<button>` elements submit forms by default.** If you want a button that doesn't submit, use `type="button"`. Otherwise, clicks trigger form submission and page reload.
- **ARIA attributes don't make inaccessible elements accessible.** `<div role="button">` still isn't keyboard accessible. Use real `<button>` elements whenever possible.
- **`aria-live="polite"` fires announcements every time content changes.** Update the same element, not create new ones. Screen reader users hear every change: "Loading... Loading complete." Very annoying. Use `aria-live` sparingly.

Example:
```html
<!-- WRONG: New element = new announcement -->
<div aria-live="polite" id="status"></div>
<script>
  status.innerHTML = '<p>Loaded 1</p>';
  status.innerHTML = '<p>Loaded 2</p>'; // Announces twice
</script>

<!-- RIGHT: Same element, updated content -->
<div aria-live="polite" id="status">Idle</div>
<script>
  status.textContent = 'Loaded 1';
  status.textContent = 'Loaded 2'; // Announces once
</script>
```

## GitHub Models API Integration

- **GitHub Models API requires authentication.** Uses `MODELS_TOKEN` (preferred) or `GITHUB_TOKEN` from secrets. If missing or invalid, API calls fail silently. Check `.env` (local) or GitHub repo settings (Actions).
- **API rate limits are per token, not per user.** If you test the workflow multiple times in one minute, you'll hit limits. Rate limit headers are in the response: `x-ratelimit-remaining`. Check them in CI logs.
- **Survey data sent as JSON must be valid.** Malformed JSON causes 400 errors. Validate structure: `{ responses: {...}, timestamp: "...", metadata: {...} }`.
- **API response timeout is 30 seconds (default fetch).** If the model takes longer, your workflow fails. No easy fix; accept that AI analysis sometimes times out.

## Browser Caching

- **GitHub Pages caches HTML for 1 minute, static assets for 1 hour.** If you update `index.html`, users might see the old version for up to 60 seconds. Add a cache-buster query param: `<script src="js/app.js?v=2">`
- **Service workers (if added) cache everything.** Test in private/incognito window to bypass cache, or manually clear via DevTools.

## DevTools & Debugging

- **DevTools Application tab shows localStorage for the current origin.** If testing on multiple ports, you see different localStorage for each. Don't confuse this with data loss.
- **`console.log()` works, but production code should avoid it.** Logs bloat CI output and leak info. Use structured logging if you need debugging in production.
- **CSS custom properties don't show inline in DevTools.** The Styles panel shows resolved values (`color: #2563eb`), not the var reference. Inspect the `:root` rule to see the actual var definitions.
