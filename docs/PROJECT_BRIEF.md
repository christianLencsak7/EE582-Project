# Project brief

## Selected topic
Wi-Fi Network Optimization: A 2.4 GHz Channel Selection Demonstrator.

This is a focused Option 3 project. The engineering content is channel overlap and a transparent heuristic for selecting among channels 1, 6 and 11. AI assists software development and explanations; the recommendation algorithm itself is deterministic, not a trained AI model.

## Why this scope
A channel-selection tool is smaller than a floor-plan propagation simulator. It avoids wall-loss estimates, spatial meshes, radio hardware, login systems and datasets while still supporting an explainable engineering model and repeatable experiments.

## Intended user experience
1. Select a synthetic scenario or edit up to ten neighboring networks.
2. Set each neighbor's channel (1–11) and received signal level (-90 to -30 dBm).
3. Select the current channel from 1, 6 or 11.
4. Inspect channel overlap and scores for all three candidates.
5. Compare the current channel with the lowest-scoring candidate.
6. Read assumptions and download the inputs and scores as CSV in the final version.

## Minimum deliverables
- Accessible website with labeled inputs, reset, presets and readable score table.
- Deterministic recommendation with explicit handling of ties.
- Clearly labeled synthetic data and educational model.
- Model tests and a reproducible scenario-results table.
- Live Vercel URL and cumulative progress slides.

## Scope boundaries
US-style channel set 1–11, fixed 20 MHz operation and a single receiver observation point. No 5/6 GHz, 40 MHz mode, live scans, real router control, floor plans, throughput estimates or trained ML. No claim of a globally optimal channel assignment across multiple APs.

## Acceptance criteria
All model cases in MODEL_AND_TEST_PLAN.md pass. Inputs reject invalid values. At least four documented scenarios reproduce their expected scores. The website works with keyboard input and at mobile width. The final deck includes actual screenshots, tested results, limitations, references and the deployed URL.
