$ErrorActionPreference = 'Stop'
$courseDir = 'C:\Users\clenc\OneDrive\StevensCourses\Year3\EE582'
$projectDir = Join-Path $courseDir 'EE582-Project'
$sourceDir = Split-Path -Parent $PSScriptRoot
if ([IO.Path]::GetFullPath($sourceDir) -eq [IO.Path]::GetFullPath($projectDir)) {
    Write-Host "Files are already in $projectDir"
    exit 0
}
if (Test-Path $projectDir) { throw 'Destination already exists. Copy the desired files manually to preserve existing work.' }
New-Item -ItemType Directory -Force -Path $courseDir | Out-Null
Copy-Item -LiteralPath $sourceDir -Destination $projectDir -Recurse
Write-Host "Project documents copied to $projectDir"
Write-Host 'See docs/SETUP.md for GitHub push instructions.'
