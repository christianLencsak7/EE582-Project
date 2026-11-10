# Channel Lab — EE 582
An interactive 2.4 GHz Wi-Fi channel selection demonstrator by Christian Lencsak.

## Open the website
Extract the complete ZIP. Double-click `public/index.html`. No installation, API key or build is needed. Keep index.html, style.css, model.js and app.js together in public/.

For a local HTTP server (optional), run `python -m http.server 8000 --directory public` from the project directory, then visit http://localhost:8000.

## Actual code
- public/index.html — page structure and explanations
- public/style.css — responsive layout and visual design
- public/model.js — pure scoring model, presets and CSV serialization
- public/app.js — interactions and channel visualization
- tests/model.test.cjs — 12 automated tests
- vercel.json — static deployment configuration

## Features
Five scenarios; up to ten editable neighboring networks; channel and received-power controls; live overlap visualization; candidate comparisons; explained recommendations and ties; simulation-only channel switching; contribution table; CSV export.

## Validation
Run `npm test` with Node.js installed. No npm install is needed. Twelve model tests passed on November 10, 2026. Desktop browser checks confirmed scenarios, recommendations, ties, adding/removing neighbors and channel editing. CSV serialization is unit-tested, but the browser download confirmation timed out. Mobile styles are implemented but a physical-device/mobile viewport check remains outstanding.

## Hosting and GitHub status
Vercel: import the GitHub repository, use Other as the framework, leave the build command empty, and serve public/. The included vercel.json declares these settings. No deployment has occurred.

GitHub: the connected integration still rejects writes with HTTP 403 (Resource not accessible by integration). No source was pushed. See docs/SETUP.md for commands to push from your own authenticated Git session.

## Course work
The docs/ folder contains the brief, model, three-week plan and progress log. slides/ contains the original Draft 1 planning snapshot and future update outlines. Draft 1 predates the website implementation and intentionally remains unchanged.

## Modeling limits
Synthetic educational inputs, fixed 20 MHz assumption, channels 1–11, one observation point. Scores are relative heuristic units, not Wi-Fi speed, measured interference, utilization or collision probability. The algorithm is deterministic. AI assisted the implementation.
