# Local setup and Vercel

## Existing Windows checkout (verified November 17, 2026)

Work in this repository only:

```text
C:\Users\clenc\OneDrive\StevensCourses\Year3\EE582\EE582-Website-v1
```

Do not initialize Git in the parent course folder or run the original package-copy setup script for this existing checkout. The repository already has `main` tracking `origin/main` and origin `https://github.com/christianLencsak7/EE582-Project.git`. Git credential helper is `manager`. The historical ChatGPT GitHub integration rejected writes with 403; local authentication/write access was not tested in this update.

## Preview and test

Double-click `public/index.html`, or run:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory public
```

Visit http://127.0.0.1:8000. Use Ctrl+C to stop the server. Run `npm test` for the model/comparison/CSV tests. No dependencies, environment variables or build are needed.

## Publishing later

No commit or push was made as part of the November 17 update. Review the local diff and the pending browser checks in DRAFT2_PROGRESS.md before publishing. Use the existing repository and authenticated local Git workflow; do not reinitialize it, reset history or force-push. Remote access must be checked when a push is actually requested.

For Vercel, import `christianLencsak7/EE582-Project` with:

- Framework: Other.
- Root Directory: repository root.
- Build Command: empty override.
- Output Directory: public.
- Environment variables: none.

The existing `vercel.json` matches these settings and is unchanged. No deployment was performed or live URL verified during this update. After publishing, verify the returned URL, record the deployed commit and URL, and repeat the browser checklist on that deployment.

Reference: https://vercel.com/docs/builds/configure-a-build (original project reference; not revalidated during this update).
