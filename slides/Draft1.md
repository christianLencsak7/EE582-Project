# 1. Wi-Fi Channel Selection

A 2.4 GHz educational demonstrator
Christian Lencsak · EE 582
Draft 1 · November 10, 2026

Speaker notes: Option 3: AI-assisted website. This is the initial proposal and model design. No website, experiments or deployment are claimed as complete.

---

# 2. Engineering objective

Compare channels 1, 6 and 11 under the same synthetic neighbors.

Explain how channel separation and received signal strength affect a simplified overlap score.

Speaker notes: Cisco channel-planning background: https://www.cisco.com/c/en/us/support/docs/smb/wireless/CB-Wireless-Mesh/2069-tz-Changing-RF-Channels.html. The score is a project-defined heuristic, not a standardized RF metric.

---

# 3. Scope and user workflow

Enter neighboring channels and signal levels.
Compare candidate scores and inspect the recommendation.
Change a scenario and explain why the result changes.

Fixed scope: 20 MHz, channels 1–11, one observation point.

Speaker notes: Planned input range: up to ten synthetic neighbors, RSSI -90 to -30 dBm. No live Wi-Fi scan, router configuration, floor-plan model or trained AI. Recommendations use channels 1, 6 and 11.

---

# 4. Model and assumptions

Overlap = max(0, 1 − |candidate − neighbor| / 5)
Power weight = 10^((RSSI + 50) / 10)
Score = sum of overlap × power weight

Lower scores are preferable within this model.

Speaker notes: The overlap function is a simplified triangular weighting chosen for this project, not an IEEE spectral mask. Power is relative to -50 dBm. The score merges effects into an educational proxy and does not simulate CSMA/CA, channel utilization or throughput.

---

# 5. Implementation status

Completed: topic, scope, model specification and test plan.
Completed: three-week schedule and initial slide draft.

Next: implement scoring and a basic browser interface.
Planned stack: HTML, CSS and JavaScript hosted on Vercel.

Speaker notes: Status as of November 10, 2026. The website has not been built or deployed. The project does not require API keys or an AI service at runtime. Vercel static deployment reference: https://vercel.com/docs/builds/configure-a-build.

---

# 6. Validation plan

One neighbor on channel 3 at −50 dBm:
Channel 1 score = 0.6; channel 6 = 0.4; channel 11 = 0.

Also check empty inputs, ties and unequal signal strength.
These are expected values. Tests have not run yet.

Speaker notes: Hand calculation: relativePower(-50)=1. Overlap with candidate 1 is 1-2/5=0.6; candidate 6 is 1-3/5=0.4; candidate 11 is max(0,1-8/5)=0. Retain the current channel if it is tied for the minimum. Otherwise use a deterministic tie-break and display all minima.

---

# 7. Limitations and open issues

Synthetic inputs and a simplified overlap function.
No prediction of measured speed or latency.
No traffic-load, hidden-node or wall-loss model.

Open work: implementation, validation and deployment.

Speaker notes: Real co-channel Wi-Fi can coordinate access through contention. An overlap score alone does not establish actual performance. Validate the implementation against the specification, and explain that this does not validate physical accuracy.

---

# 8. Three-week schedule

Nov 10–16: scoring logic and basic interface. Draft 2: Nov 16.
Nov 17–23: visualization and deployment. Draft 3: Nov 23.
Nov 24–30: validation and final demonstration. Final: Nov 30.

Draft 1 was listed for Nov 9. This draft is prepared Nov 10.

Speaker notes: Dates come from the supplied Canvas module listing. Christian should confirm the late-submission arrangement for Draft 1. No submission or extension is claimed. Preserve the same section order in future drafts and replace planned work with dated evidence only after completion.

---

# 9. References and AI assistance

Course project options and Canvas milestone listing.
Cisco: RF Channels on a Cisco Business Wireless Network.
Vercel: Configuring a Build.

AI assisted planning and slides. The proposed algorithm is deterministic.

Speaker notes: Sources: course-provided Project Options.pdf; supplied Pasted text.txt; https://www.cisco.com/c/en/us/support/docs/smb/wireless/CB-Wireless-Mesh/2069-tz-Changing-RF-Channels.html; https://vercel.com/docs/builds/configure-a-build. Accessed November 10, 2026. Christian reviews technical details and presents the project. Instructor slide suggestions were linked but not supplied or inspected.
