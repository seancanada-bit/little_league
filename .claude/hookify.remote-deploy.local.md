---
name: remote-deploy-verification
enabled: true
event: stop
action: warn
conditions:
  - field: transcript
    operator: not_contains
    pattern: "pacificlogo.ca/sandbox/baseball-coach"
---

**[baseball-coach]** This project deploys via GitHub Actions FTP — no local dev server needed.

Verification is done directly in Chrome against the live URL:
https://pacificlogo.ca/sandbox/baseball-coach/

If you edited UI code and haven't verified in Chrome yet, check the live site before finishing.
To deploy: `git push` triggers GitHub Actions automatically (~22 seconds).
