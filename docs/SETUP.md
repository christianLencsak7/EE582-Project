# Windows and Vercel setup

## Windows course folder
This cloud workspace cannot write directly to your Windows C: drive. Extract the downloaded ZIP, then run scripts/Setup-EE582.ps1 from the extracted project. It copies the whole project into:

    C:\Users\clenc\OneDrive\StevensCourses\Year3\EE582\EE582-Project

The script stops if that destination already exists and never overwrites existing coursework.

## GitHub push status and fallback
The connected GitHub integration rejected the initial file creation with HTTP 403, "Resource not accessible by integration". No files were pushed. The repository was empty when inspected November 10, 2026.

Once the files are copied, run these commands in PowerShell with Git for Windows installed and your own GitHub sign-in available:

```powershell
Set-Location 'C:\Users\clenc\OneDrive\StevensCourses\Year3\EE582\EE582-Project'
git init -b main
git remote add origin https://github.com/christianLencsak7/EE582-Project.git
git add .
git commit -m "Add EE582 project plan and initial progress slides"
git push -u origin main
```

Run these only for a fresh extracted package without an existing Git repository. If the remote gains commits before you push, Git will reject a conflicting push. Do not force-push: clone the latest repository separately and copy these files into it. Alternatively, enable repository content-write access for the ChatGPT GitHub connection and retry the push here.

## Vercel deployment (planned for Week 2)
The working website is now in public/. No Vercel deployment has occurred.
1. Sign in to Vercel and import christianLencsak7/EE582-Project.
2. Choose the Other framework preset and repository root as Root Directory.
3. Set Build Command override to empty and Output Directory to public.
4. Deploy. Open the returned URL and verify presets, scores, mobile layout and console output.
5. Record the real URL and deployed commit in the progress log and slides.

No environment variables or API keys are needed for this design. Later GitHub updates can deploy through the connected Vercel project. Do not invent a live URL before deployment succeeds.

Reference: https://vercel.com/docs/builds/configure-a-build

## Existing course folder
If you already extracted the earlier package, keep it as a planning snapshot. Extract this new package alongside it as EE582-Website-v1, then open public/index.html inside the new folder. This avoids overwriting local edits. Copy or merge into your preferred project directory when ready.
