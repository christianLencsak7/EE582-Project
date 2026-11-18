# Channel Lab - EE 582

An interactive 2.4 GHz Wi-Fi channel selection demonstrator by Christian Lencsak, Computer Science, Stevens Institute of Technology.

## Open and try it

Double-click `public/index.html`; no installation, API key or build is needed. Keep the four files in `public/` together. Alternatively, from this repository:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory public
```

Open http://127.0.0.1:8000. Select **Channel overlap**, then **Apply channel 11 & save comparison**. The saved result is channel 1 to 11, score **0.6 to 0**, absolute reduction **0.6**, and **100% model score reduction**. Change the neighbor's signal strength to see live scores change while the saved baseline stays intact. This percentage is not a measured speed improvement.

## Features

- Five synthetic scenarios; up to ten neighbors with editable names, channels 1-11 and RSSI from -90 to -30 dBm.
- Live triangular overlap visualization, matching network colors, numeric power legend, and an explicit automatic-scale explanation.
- Scores for channels 1, 6 and 11; separate current/minimum badges; deterministic recommendations with explained ties.
- One saved before-and-after comparison, including independent inputs, original/applied channels, absolute and percentage model score reduction.
- Compact glossary, step-by-step worked example, per-network contributions and primary technical references.
- CSV containing current inputs/results and a separately labeled saved snapshot, with full numeric precision and spreadsheet formula protection for names.
- Responsive layouts, keyboard focus styles, labeled controls, table scrolling and reduced-motion support. Browser verification remains pending; see below.

## Saved comparison behavior

Applying a meaningful change creates or replaces the one snapshot. Repeated application or an already-minimum channel does not overwrite it; the UI disables the unnecessary action. Neighbor edits, additions/removals and manual current-channel changes retain it, with a visible warning if the live neighbor inputs differ. **Clear comparison** removes only the snapshot. **Reset scenario** restores the last selected preset and clears the snapshot. Clicking any preset also clears it. Reloading the page starts fresh; no database or browser storage is used.

A zero baseline has no defined percentage reduction. Empty inputs tie all candidates and provide no reason to switch. Equal minima retain the current channel; otherwise the lowest-numbered minimum wins the tie-break.

## Files and tests

- `public/index.html`, `public/style.css`: structure, explanations and presentation.
- `public/model.js`: pure scoring, comparison/state helpers, presets and CSV serialization.
- `public/app.js`: controls, SVG visualization, saved comparison and download action.
- `tests/model.test.cjs`: 27 tests, including the original 12.
- `docs/DRAFT2_PROGRESS.md`: dated outcomes, evidence and remaining checks.
- `docs/evidence/channel-overlap-comparison.csv`: model-generated example export (not a browser download).

Run `npm test` with Node.js installed. No `npm install` is required. On November 17, 2026, baseline **12/12** and expanded **27/27** tests passed with Node 22.14.0. JavaScript syntax, HTML element references/nesting and selected text-color contrast calculations also passed. The local HTTP endpoint returned 200.

The sandbox initially prevented Node's test subprocess (`spawn EPERM`); the suite passed when run with approved execution outside that sandbox. Browser automation was blocked by its environment/URL verification guard. Desktop/mobile rendering, keyboard interaction, application console and actual CSV downloads were not verified in this update, and no screenshots were captured. See the manual checklist in `docs/DRAFT2_PROGRESS.md`.

## Git and static hosting

The actual project root is `EE582-Website-v1`, not the surrounding EE582 course directory. Local inspection found branch `main`, tracking `origin/main`, and origin `https://github.com/christianLencsak7/EE582-Project.git`. The starting working tree was clean. The existing Git credential helper is `manager`; remote write access was not tested. Historical ChatGPT integration 403 errors do not establish whether local Git can push.

No commit, push, deployment or Canvas submission was performed during this update. Vercel configuration remains: framework **Other**, repository root, empty build command, output directory **public**, no environment variables. Check the deployed URL after publishing separately. See `docs/SETUP.md`.

## Model scope

The original formulas are unchanged: triangular overlap `max(0,1-abs(c-n)/5)` and power `10^((RSSI+50)/10)`, summed as power times overlap. Fixed 20 MHz assumption, synthetic inputs, one observation point. These relative scores are not a spectral mask, measured interference, Mbps, latency, channel utilization or collision probability. The tool does not simulate CSMA/CA, traffic load, hidden nodes, walls, multipath or non-Wi-Fi interferers; it neither scans Wi-Fi nor configures routers. AI assists development; the recommendation algorithm is deterministic.

The original slides remain unchanged. This November 17 work supports Draft 2 (listed November 16); remaining milestones are Draft 3 on November 23 and final slides on November 30. No submission is implied.
