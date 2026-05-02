$ErrorActionPreference = "Stop"

$src_kalika = "C:\GALIH\CODING\LENTERA\lentera\KALIKA\src"
$src_lentera = "C:\GALIH\CODING\LENTERA\lentera\src"
$tw_kalika = "C:\GALIH\CODING\LENTERA\lentera\KALIKA\tailwind.config.ts"
$tw_lentera = "C:\GALIH\CODING\LENTERA\lentera\tailwind.config.ts"

Write-Host "Removing LENTERA src..."
Remove-Item -Path $src_lentera -Recurse -Force

Write-Host "Copying KALIKA src to LENTERA src..."
Copy-Item -Path $src_kalika -Destination $src_lentera -Recurse -Force

Write-Host "Copying tailwind.config.ts..."
Copy-Item -Path $tw_kalika -Destination $tw_lentera -Force

Write-Host "Renaming files containing 'kalika'..."
Get-ChildItem -Path $src_lentera -Recurse | Where-Object { $_.Name -match "kalika" -or $_.Name -match "Kalika" } | Rename-Item -NewName { $_.Name -replace "kalika", "lentera" -replace "Kalika", "Lentera" } -PassThru

Write-Host "Replacing strings in all source files..."
$files = Get-ChildItem -Path $src_lentera -File -Recurse
$files += Get-Item $tw_lentera

foreach ($file in $files) {
    if ($file.Extension -match "\.(ts|tsx|js|jsx|css|json)$") {
        $content = Get-Content -Path $file.FullName -Raw
        if ($content -match "kalika|KALIKA|Kalika") {
            $newContent = $content -creplace "KALIKA", "LENTERA"
            $newContent = $newContent -creplace "Kalika", "Lentera"
            $newContent = $newContent -creplace "kalika", "lentera"
            
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
        }
    }
}

Write-Host "Migration complete!"
