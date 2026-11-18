# Draft 2 progress - Channel Lab

**Author:** Christian Lencsak, Computer Science, Stevens Institute of Technology  
**Course:** EE 582 Wireless Networking  
**Work completed:** November 17, 2026 (America/New_York)  
**Purpose:** Week 2 improvements supporting Draft 2. The listed Draft 2 milestone was November 16; this record is not backdated. No Canvas submission is claimed.

## 1. Starting point

The existing plain HTML/CSS/JavaScript application already contained five synthetic scenarios, up to ten editable neighbors, a triangular overlap chart, scores for channels 1/6/11, deterministic recommendations, a contribution table and CSV export. The original 12 tests passed before editing.

Applying a recommendation changed the current channel and erased the visible original baseline. There was no saved comparison or associated input snapshot. Basic formula explanations existed, but no compact glossary or fully worked example. The chart rescaled without a prominent numeric scale explanation. CSV exported live results only and did not preserve blank names or protect formula-like names preceded by spaces.

The actual repository is `C:\Users\clenc\OneDrive\StevensCourses\Year3\EE582\EE582-Website-v1`. It began clean on `main`, tracking `origin/main`, at `15e3b68` (Build initial EE582 Channel Lab website). Origin is `https://github.com/christianLencsak7/EE582-Project.git`; credential helper is `manager`. No applicable AGENTS.md files were found in the checkout or ancestors. No commit, push or remote write-access test was performed.

## 2. Week 2 changes and why they matter

| Change | Benefit to the demonstration |
|---|---|
| One saved before-and-after component | Keeps the original baseline visible after applying the recommended channel. |
| Independent copy of neighbor inputs and all candidate scores | Live edits cannot silently change the evidence behind an older comparison. |
| Absolute/percentage reductions, original/applied channels, tie explanation | Makes the numerical result explainable; clearly identifies model score reduction rather than speed. |
| Explicit clear, reset and preset rules | Avoids surprising changes and prevents repeated clicks from destroying a useful snapshot. |
| Compact glossary and worked example | Explains channels, RSSI, dBm, linear power and why neighbor counts alone are insufficient. |
| Auto-scale note and numeric network legend | Prevents a weak but tall auto-scaled shape from being mistaken for a fixed power measurement. |
| Separate Current and Minimum labels | Communicates both meanings simultaneously, including ties, without relying only on color. |
| Stronger text contrast, larger controls, focus styles, responsive comparison | Improves readability and supports keyboard/mobile use; rendered verification remains pending. |
| Extended CSV metadata and separate saved section | Makes current and historical inputs/results reproducible without mixing them. |
| Fifteen additional tests | Covers comparison lifecycle and exports in addition to the original model checks. |

The recognizable green Channel Lab design, original five presets, scoring model and static hosting approach remain. No framework, backend, database, accounts, paid API, runtime AI, hardware dependency or build pipeline was added. The PowerPoint was not changed.

## 3. Implementation in plain language

`public/model.js` still sums linear relative power times the project's triangular overlap weight. New pure helpers calculate a comparison, apply a recommendation, create fresh preset state, clear a comparison and compare live inputs with saved inputs. The comparison stores copies of each neighbor and the analysis results. `public/app.js` renders that saved object independently from the live scenario.

A meaningful application replaces the single snapshot and changes the simulated current channel. Applying again while already on a minimum does nothing; the UI disables that action. Edits, adding/removing neighbors and manually changing the current channel retain the snapshot. Changed neighbor inputs produce an explicit saved-input warning. Clear removes only the snapshot. Reset restores the last selected preset, and selecting any preset loads it; both clear the snapshot. Reload starts with Busy dorm and no snapshot. There is no storage across reloads.

The CSV has five columns and labeled sections. Current rows use live inputs and calculations; saved rows use stored inputs and results. Numeric values use JavaScript's full serialization precision. Names are quoted, embedded quotes doubled, blank names retained, and formula-like names prefixed with an apostrophe even after leading whitespace. Metadata explains the protection. The download code adds a UTF-8 BOM and uses a scenario/custom/UTC-timestamp filename.

## 4. Actual validation results

Executed November 17, 2026, with Node v22.14.0:

| Check | Actual result |
|---|---|
| Original suite, `npm test` | 12 passed, 0 failed |
| Expanded suite, `npm test` | 27 passed, 0 failed, 0 skipped |
| `node --check public/model.js` | Passed |
| `node --check public/app.js` | Passed |
| HTML static inspection | Tag nesting, unique IDs, local anchor targets and referenced app element IDs passed |
| Main text palette calculations | Selected text/background pairs meet 4.5:1; lowest tested pair 4.78:1 |
| Local HTTP request | HTTP 200 from the static preview |
| `git diff --check` | Passed; Git emitted only LF/CRLF normalization notices |
| Real browser interactions/download/layout/console | Not verified; environment blocked browser access |

The original sandbox test attempt failed with `spawn EPERM` before running the tests. Approved execution outside the sandbox passed. This was an environment failure, not a failing model assertion.

Automated coverage includes all five hand-derived expected-score cases, ties/current retention, near ties, empty input, zero baseline, +10 dB power scaling, bounds and invalid values, ten-neighbor limit, exact before/after reductions, independent snapshots, repeat application, later meaningful replacement, reset/preset independence, clearing, and CSV consistency. CSV tests parse the output independently and cover commas, quotes, Unicode, embedded newlines, blank names, formula prefixes, empty exports, full precision and separated current/saved data.

Browser inventory returned **"The browser access host is unavailable."** A native Chrome fallback was then stopped because Computer Use could not determine the current browser URL confidently enough to enforce policy. No page controls were exercised. No screenshots were captured. No application console was inspected, so the update makes no "no console errors" claim. Physical mobile and screen-reader checks also remain pending. Prior November 10 browser results do not verify this changed UI.

## 5. Reproducible demonstration and actual outputs

Open `public/index.html` (or serve `public/` locally). Choose **Channel overlap**. It starts on channel 1 with one neighbor named "Neighbor on channel 3", channel 3, RSSI -50 dBm.

1. Relative power: `10^((-50 + 50)/10) = 1`.
2. Candidate distances from channel 3: 2, 3, 8.
3. Overlap weights: `max(0,1-distance/5)` gives 0.6, 0.4, 0.
4. Multiply by power 1: the actual model scores are **0.6, 0.4, 0**.
5. Apply channel 11 to save this comparison:

| Field | Actual model output |
|---|---:|
| Original channel | 1 |
| Recommended/applied channel | 11 |
| Before score | 0.6 |
| After score | 0 |
| Absolute reduction | 0.6 relative units |
| Model score reduction | 100% |

These outputs were calculated by the implementation and verified in tests; the click sequence is a reproducible manual procedure, not a claim of an executed browser test. The generated artifact is [evidence/channel-overlap-comparison.csv](evidence/channel-overlap-comparison.csv). It is a model-generated export, **not evidence of a browser download**.

After applying, change the live neighbor to -40 dBm: live scores should be 6, 4 and 0; the saved comparison remains 0.6 to 0 with its original -50 dBm input. Use the saved-input disclosure to explain why. The independence is automated-tested; this exact UI interaction remains to be checked.

A second automated-verified scenario is **Signal strength**: neighbors on 1/-40, 6/-50, 11/-60 yield scores **10 / 1 / 0.1**. Starting on 1 and applying 11 gives **9.9 relative units** absolute reduction and **99% model score reduction**. Balanced channels retain current channel 6; empty inputs retain the current channel and have no applicable percentage reduction.

## 6. Technical limits and known issues

The model uses a project-defined triangular heuristic, not the IEEE spectral mask. Relative scores are not measured interference, Mbps, latency, channel utilization or collision probability. Co-channel Wi-Fi can contend for airtime, which this score does not simulate. Traffic load, hidden nodes, walls, multipath and non-Wi-Fi interferers are absent. Assumptions are fixed 20 MHz operation, 2.4 GHz channels 1-11 and one observation point. No Wi-Fi scan or router change occurs.

The chart automatically scales to the strongest current modeled power; the label and numeric legend disclose this. Saved comparisons last only for the current page session and are replaced by the next meaningful application. CSV sections are human-readable metadata plus typed rows, not a single rectangular neighbor dataset for immediate charting. Formula protection intentionally adds an apostrophe to certain names.

No automated model failures remain. Rendered desktop/mobile behavior, keyboard operation, screen-reader announcements, the browser console, actual download completion and the Vercel deployment remain unverified. The Fortinet power-scale source was available through its search excerpt; its direct web fetch returned 403. Primary Cisco sources were accessible. See SOURCES_AND_AI.md.

## 7. Browser checklist before publishing

- At desktop width, load each preset and confirm expected scores, ties and Current/Minimum labels.
- Add up to ten neighbors, confirm the add limit, then remove them. Edit names, channel select boxes and RSSI sliders; check focus after add/remove.
- Apply Channel overlap; verify 1 to 11, 0.6 to 0 and 100% model score reduction. A repeated application must not replace it.
- Edit a neighbor after applying; verify the snapshot warning and unchanged saved inputs/results. Manually change current channel and check it remains separate from the saved result.
- Clear the comparison and verify live values remain. Apply again, then reset and switch presets; verify both restore/clear as documented.
- Export after live edits with a saved snapshot. Confirm a real file downloads with the expected filename and distinct live/saved inputs. Repeat with blank names, quoted/comma names, formula-like names and an empty scenario.
- Check desktop and 390 px and 320 px widths: no horizontal page overflow, legible scores/comparison, comfortable controls and independently scrolling tables. Check -90 dBm and no-neighbor chart cases.
- Use keyboard only: skip link, presets, name inputs, channel selectors, arrow-key RSSI adjustments, Apply, Clear, Reset, Export, glossary and table regions. Verify visible focus and no traps. Review announcements with a screen reader, including no repeated recommendation announcements during name typing.
- Inspect the console and network panel for application errors or missing assets. Repeat on the eventual Vercel URL; local success alone is insufficient.

## 8. Remaining course work

Before Draft 3 on **November 23**: perform the browser checklist, capture real screenshots, review wording with Christian, prepare Draft 2 slides in the separate slide task, and commit/push/deploy only when requested. Confirm local Git write access when actually publishing rather than assuming the old ChatGPT integration restriction applies.

Before final slides on **November 30**: verify the deployed URL, record its actual commit/URL, rehearse a short demonstration, and include measured model outputs, assumptions, sources and AI disclosure. Do not present model consistency tests as real-world RF validation.

## 9. AI-assistance disclosure

AI assisted implementation, debugging, test design, explanation drafting, source lookup and progress documentation. Christian remains responsible for reviewing and explaining the project. The site's recommendation is deterministic arithmetic; it does not invoke a trained AI model. No commit, push, deployment, PowerPoint revision or course submission was performed in this task.

## 10. Screenshots and slide talking points

**Screenshot status: none captured.** The following are capture instructions, not existing image files:

| Suggested capture | Setup and talking point |
|---|---|
| Main simulator | Busy dorm at desktop width; explain matching colors, auto-scale note, power legend and candidate scores. |
| Saved comparison | Signal strength immediately after applying 11; show 10 to 0.1, 9.9 units and 99% model score reduction. |
| Saved versus live inputs | Change one neighbor after applying; show the saved-input warning and original input disclosure. |
| Worked example | Show the channel-3/-50 dBm table with 0.6 / 0.4 / 0 and explain power times overlap. |
| Mobile layout | Capture at 390 px with the recommendation and saved comparison legible; inspect 320 px separately. |

Suggested talking sequence: "The first version lost its baseline. Now applying a channel preserves the exact inputs and result. The math is small enough to calculate by hand, and the export keeps saved and live data separate. Twenty-seven automated tests check consistency, while browser verification is still pending. These percentages describe this model, not measured Wi-Fi speed."
