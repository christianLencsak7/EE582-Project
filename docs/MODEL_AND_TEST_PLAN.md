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

## Hand-derived expected cases (not yet executed tests)
| Scenario | Inputs (channel, dBm) | Score 1 | Score 6 | Score 11 | Minima |
|---|---|---:|---:|---:|---|
| Empty | none | 0 | 0 | 0 | 1, 6, 11 |
| One neighbor | (1,-50) | 1 | 0 | 0 | 6, 11 |
| Adjacent overlap | (3,-50) | 0.6 | 0.4 | 0 | 11 |
| Unequal strength | (1,-40), (6,-50), (11,-60) | 10 | 1 | 0.1 | 11 |
| Balanced | (1,-50), (6,-50), (11,-50) | 1 | 1 | 1 | 1, 6, 11 |

## Automated tests to implement
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
