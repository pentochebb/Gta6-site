$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop "Lancer GTA 6 Local.lnk"
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($shortcutPath)
$sc.TargetPath = "c:\Users\user\Downloads\gta6-site-main\gta6-site-main\start_server.bat"
$sc.WorkingDirectory = "c:\Users\user\Downloads\gta6-site-main\gta6-site-main"
$sc.IconLocation = "shell32.dll,14"
$sc.Description = "Lancer le site GTA 6 en local"
$sc.Save()
Write-Host "Raccourci cree avec succes : $shortcutPath"
