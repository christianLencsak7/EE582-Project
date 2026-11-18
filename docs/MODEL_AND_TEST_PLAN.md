# Model and validation specification

## Educational assumptions
Use 20 MHz channels and a simplified triangular overlap weight. This is a project-defined heuristic, not the IEEE spectral mask, a validated interference predictor or Cisco's channel-assignment algorithm.

For candidate channel c and neighbor channel n:

    overlap(c,n) = max(0, 1 - abs(c-n)/5)
    relativePower(rssi_dBm) = 10 ** ((rssi_dBm + 50)/10)
    score(c) = sum(relativePower(neighbor.rssi) * overlap(c,neighbor.channel))

Candidates are 1, 6 and 11. RSSI is an observation at one point. Power is normalized to -50 dBm, so -50 dBm contributes 1 unit, -60 dBm contributes 0.1 units, and -40 dBm contributes 10 units before overlap weighting. Do not add dBm values directly.

Scores have arbitrary relative units. Lower is preferable within this model. Do not label scores as Mbps, latency, percentage utilization or collision probability. Co-channel Wi-Fi can share airtime through contention; this score does not simulate CSMA/CA or distinguish airtime contention from adjacent-channel interference in a physical model.

## Recommendation and ties
Return all minimum-score candidates, using tolerance abs(a-b) <= 1e-12 * max(1,abs(a),abs(b)). If the current channel is among the minima, retain it. Otherwise choose the lowest-numbered minimum for a deterministic display and explain that this is only a tie-break. With no neighbors, report all candidates tied and no demonstrated reason to switch.

Optional score reduction = 100*(current-best)/current only when current > 0. When current is zero, show 'not applicable'. Label this 'model score reduction', never 'speed improvement'.

## Hand-derived expected cases (executed in the automated suite)
| Scenario | Inputs (channel, dBm) | Score 1 | Score 6 | Score 11 | Minima |
|---|---|---:|---:|---:|---|
| Empty | none | 0 | 0 | 0 | 1, 6, 11 |
| One neighbor | (1,-50) | 1 | 0 | 0 | 6, 11 |
| Adjacent overlap | (3,-50) | 0.6 | 0.4 | 0 | 11 |
| Unequal strength | (1,-40), (6,-50), (11,-60) | 10 | 1 | 0.1 | 11 |
| Balanced | (1,-50), (6,-50), (11,-50) | 1 | 1 | 1 | 1, 6, 11 |

## Automated coverage implemented
- Check every hand-derived case with numeric tolerance.
- A +10 dB change multiplies one neighbor's contribution by ten.
- Reordering neighbors cannot change a score.
- Scores are finite and nonnegative for valid inputs.
- Selected channel is always one of 1, 6 or 11 and attains a minimum.
- Current minimum is retained on a tie.
- Reject NaN, infinity, empty numeric fields, fractional/out-of-range channels, and RSSI outside -90 to -30.
- Empty network lists and maximum list size work.
- CSV values match the displayed scores for identical inputs.

## Manual checks to record
Chrome desktop and narrow mobile viewport, keyboard-only operation, visible focus, accessible labels, reset behavior and no console errors. Check the deployed URL separately from the local copy.

## Results discipline
Keep predictions above separate from executed results. Record date, commit, input values, expected value, actual value and pass/fail. A successful synthetic experiment establishes implementation consistency, not real-world RF accuracy.


## Week 2 comparison behavior (November 17, 2026)

The scoring formulas, candidate set and tie tolerance above are unchanged. Inputs remain 0-10 neighbors, integer channels 1-11, finite numeric RSSI from -90 to -30 dBm and current channel 1, 6 or 11. Device-specific RSSI is not inherently the same scale across radios; this simulator explicitly represents its received level in dBm.

`createComparison(networks,current)` analyzes once and copies neighbor names/channels/RSSI, all three scores and tied minima. It stores before/after channels and scores, `max(0,before-after)` absolute reduction and a nullable percentage. A zero baseline yields `null`, displayed/exported as not applicable. Display values use four significant figures (scientific notation for small nonzero values); CSV retains JavaScript numeric precision. Percentages just below 100 are shown as >99.999% rather than rounding a positive after-score to a claimed 100% reduction.

`applyRecommendation(state)` returns the original state unchanged when the current channel is already a minimum. Otherwise it changes the current channel and replaces the one saved comparison. Its copied inputs are independent of subsequent live edits. No history or persistent storage is used.

| Action | Saved comparison | Live inputs/current channel |
|---|---|---|
| Apply a meaningful recommendation | Create or replace | Change current to the recommendation |
| Apply again/already minimum | Retain | No change |
| Edit/add/remove a neighbor | Retain; label when live inputs differ | Update live results |
| Manually change current channel | Retain; show live current separately | Recalculate live recommendation |
| Clear comparison | Remove | Retain |
| Reset scenario | Remove | Restore last selected preset |
| Click any preset | Remove | Load that preset |
| Reload page | Remove | Load Busy dorm |

`presetState` is the same pure reset/load function used by the UI, returning independent preset inputs. `clearComparison` preserves the live state. `snapshotMatches` checks names, channels, strengths and list length to label live/saved differences. The snapshot can be expanded to inspect its associated inputs.

## CSV contract

Five columns: type, name, channel, rssi_dBm, model_score. Metadata rows describe the model formulas, relative units, fixed operating assumptions and name escaping. A CURRENT SCENARIO section has neighbor, candidate, current, recommended and minima rows. An optional SAVED COMPARISON section has saved_neighbor, saved_candidate, saved_before, saved_applied, saved_absolute_reduction, saved_percent_reduction and saved_minima rows. The percent row explicitly labels its percent unit; it is not an ordinary score row. Metadata/section rows are for reading, not neighbors.

All cells are double-quoted; embedded quotes are doubled. Blank names remain empty so the input can be reproduced. Formula-like names (including leading whitespace before =, +, -, @, or leading tab/newline/carriage return) receive an apostrophe prefix for spreadsheet safety; the metadata explains this intentional transformation. Raw JavaScript numbers retain round-trip precision. The browser download adds a UTF-8 BOM for spreadsheet Unicode handling, with a filename containing scenario/custom state and a UTC timestamp. Saved values come from the saved object, never the edited live inputs. The pure export file in docs/evidence has no BOM.

## Executed results - November 17, 2026

Baseline: 12 tests passed. Expanded suite: 27 tests passed, 0 failed, 0 skipped, Node v22.14.0. The first sandbox attempt failed before executing tests with spawn EPERM; approved execution outside that sandbox passed. All hand-derived cases in the table above are covered. Added cases cover exact reductions, zero baselines, copied snapshots, repeat applications, later meaningful replacement, reset/preset independence, clearing, floating-point near ties, power scaling, bounds, network counts, CSV parsing/escaping/formula protection, separate live/saved sections and empty exports.

Static checks passed: JavaScript syntax, HTML tag nesting, unique IDs, local anchor targets and app element references. Selected text/background colors passed calculated 4.5:1 normal-text contrast; this is not a full accessibility audit. A local HTTP GET returned 200. Browser connection/URL verification was blocked, so actual rendering, mobile overflow, keyboard operation, console output, screen-reader behavior and downloads are pending. See DRAFT2_PROGRESS.md for the precise checklist and evidence limits.
