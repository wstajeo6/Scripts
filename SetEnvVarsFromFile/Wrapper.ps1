Write-Host "Running wrapper"
"C:\Git\scripts\Init.ps1"
$path1 = [Environment]::GetEnvironmentVariable('PATH1', 'Process')
$path2 = [Environment]::GetEnvironmentVariable('PATH2', 'Process')

Write-Host "$path1"
Write-Host "$path2"