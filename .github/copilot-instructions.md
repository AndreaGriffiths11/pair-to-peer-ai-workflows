# AI Workflows Project - Copilot Instructions

## Project Overview
This is an educational static site project showcasing "From Pair to Peer" AI workflows. The site contains interactive assessments and decision trees to help teams adopt AI development practices. Built with vanilla HTML/CSS/JS and deployed via GitHub Pages.

## Architecture & File Structure
- **`docs/`**: Main site (GitHub Pages root)
  - Interactive HTML tools: `index.html` (decision tree), `team-assessment.html`, `developer-experience.html`, `teaching-moments.html`
  - JavaScript modules in `docs/js/` follow class-based patterns (see `DecisionTree` class in `decision-tree.js`)
  - CSS uses CSS custom properties for theming (`--accent`, `--surface-elevated`, etc.)
- **`templates/`**: Markdown templates for team processes (not web content)
- **`.github/workflows/`**: AI analysis pipeline using GitHub Models API

## Key Patterns & Conventions

### JavaScript Architecture
- Use ES6 class-based modules with explicit `export default`
- Event delegation pattern: attach listeners in `initializeEventListeners()` method
- State management via localStorage with consistent key naming (e.g., `teamAssessmentData`, `teamAssessmentSummary`)
- Progressive enhancement: all functionality works without JavaScript, enhanced with interactions

### CSS Conventions
- CSS custom properties for consistent theming across all pages
- Component-based naming: `.node`, `.assessment-item`, `.criteria-matrix`
- Responsive design with mobile-first approach and `@media (max-width: 768px)` breakpoints
- Accessibility patterns: `.sr-only` class, proper ARIA attributes, focus management

### Data Flow Patterns
- Assessment tools serialize results to localStorage as JSON
- GitHub Actions workflow (`ai-analysis.yml`) processes survey data via `process-analysis.js` 
- Results stored as workflow artifacts with standardized naming: `analysis-results-{run_id}`

## Critical Workflows

### Local Development
```bash
# Serve locally (any HTTP server works)
python -m http.server 8000  # Then visit docs/ folder
# or
npx serve docs
```

### AI Analysis Integration
The `developer-experience.html` tool integrates with GitHub Models API:
1. User completes survey → data serialized to JSON
2. "Generate AI Insights" triggers GitHub Actions workflow
3. Workflow calls GitHub Models API via `process-analysis.js` 
4. Results returned as downloadable artifact

Key integration points:
- Survey data format: `{ responses: {...}, timestamp: "...", metadata: {...} }`
- API auth via `MODELS_TOKEN` secret (fallback to `GITHUB_TOKEN`)
- Error handling for API failures in `callGitHubModels()` function

## Project-Specific Guidelines

### When Editing Interactive Tools
- Maintain accessibility: update ARIA attributes when showing/hiding content
- Use `scrollIntoView({ behavior: 'smooth', block: 'center' })` for navigation
- Follow focus management pattern: set focus after transitions with 500ms delay
- Preserve localStorage state across page refreshes

### CSS Updates  
- Always test responsive behavior on mobile screens
- Maintain color contrast ratios for accessibility 
- Use existing CSS custom properties before adding new ones
- Test theme consistency across all 5 HTML pages

### Adding New Assessment Features
- Follow the established pattern: class-based JS with localStorage persistence
- Maintain the three-pattern framework: Standards-First, Experience-Focus, Fluency-Building
- Update both interactive tools AND corresponding markdown templates

## Dependencies & Integrations
- **No build process**: Vanilla HTML/CSS/JS only
- **GitHub Pages**: Auto-deploy from `docs/` folder on push to main
- **GitHub Models API**: GPT-4o-mini for AI analysis features
- **Font**: Inter from Google Fonts (preconnect optimized)

The goal is immediate productivity for teams adopting AI development practices, not technical complexity.