# Sources and AI assistance

1. Course-provided Project Options.pdf: Option 3 requires a demonstration/illustration website URL and slides. Read November 10, 2026.
2. Supplied Canvas module listing (Pasted text.txt): Draft 1 November 9, Draft 2 November 16, Draft 3 November 23, final November 30. Read November 10, 2026.
3. Cisco, RF Channels on a Cisco Business Wireless Network, updated May 29, 2020. https://www.cisco.com/c/en/us/support/docs/smb/wireless/CB-Wireless-Mesh/2069-tz-Changing-RF-Channels.html — Supports channel-planning background and the 1/6/11 candidate set. Accessed November 10, 2026.
4. Vercel, Configuring a Build. https://vercel.com/docs/builds/configure-a-build — Supports static HTML/CSS/JS deployment using the Other preset and a public output directory. Accessed November 10, 2026.

The triangular overlap function and normalized score are project modeling choices. They are not quoted from these sources. The website discloses this distinction.

## AI disclosure
AI assisted topic selection, scope, documentation and initial slides. Future assistance may include implementation, debugging and test design. The channel recommendation is a deterministic heuristic. No trained ML model or LLM runs inside the proposed website. Christian should verify the code, calculations and presentation and record material AI assistance in the progress log.

## Course source handling
The public GitHub repository contains original project materials and references, not copies of course PDFs or the full Canvas listing. The instructor's Project slides suggestions.pptx was linked but was not attached or inspected; this initial deck uses a new consistent design, not a claimed copy of that template.


## Week 2 sources checked November 17, 2026

- Cisco, RF Channels on a Cisco Business Wireless Network: https://www.cisco.com/c/en/us/support/docs/smb/wireless/CB-Wireless-Mesh/2069-tz-Changing-RF-Channels.html - channel planning and the 1/6/11 plan; page opened and read.
- Cisco, Radio Resource Management under Unified Wireless Networks: https://www.cisco.com/c/en/us/support/docs/wireless-mobility/wireless-lan-wlan/71113-rrm-new.html - logarithmic dBm and the caution that radios report RSSI differently; page opened and relevant definitions checked.
- Fortinet, Signal, FortiAP/FortiWiFi 7.0.0 Secure Wireless Concept Guide: https://docs.fortinet.com/document/fortiap/7.0.0/secure-wireless-concept-guide/163298/signal - logarithmic power conversion. Search-index excerpt was available; direct page fetch returned HTTP 403. The -40 versus -70 dBm power ratio is derived from the logarithmic definition, not an empirical measurement.
- Cisco, WLAN DSSS and CSMA/CA: https://www.cisco.com/E-Learning/bulk/guest/celc/fwl/ch3/3_6_2/content.html - shared-medium contention and random backoff; page opened and read.

The simplified triangular overlap function, -50 dBm normalization, selected candidate set and comparison rules belong to this project. The worked example is derived from the implemented formulas. Primary references provide background; they do not validate the heuristic as a performance predictor.

AI assisted the Week 2 implementation, explanations, source lookup, test design and documentation. The website performs deterministic arithmetic locally, without runtime AI calls. Christian should review the technical interpretation and rehearse the demonstration. No slides or course submissions were changed by this update.
