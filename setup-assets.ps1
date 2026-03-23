# Run from TepelniElektrarna\ directory
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$frontScreens = @('screen_oled2', 'screen_oled4', 'screen_6', 'screen_9')
$backScreens  = @('screen_2R', 'screen_4R', 'screen_7R', 'screen_8R', 'screen_10')

function Make-Junction($screen, $linkName, $target) {
    $publicDir = Join-Path $root "$screen\public"
    if (-not (Test-Path $publicDir)) { New-Item -ItemType Directory -Force -Path $publicDir | Out-Null }
    $linkPath = Join-Path $publicDir $linkName
    if (-not (Test-Path $linkPath)) {
        $targetPath = Join-Path $root $target
        cmd /c "mklink /J `"$linkPath`" `"$targetPath`"" | Out-Null
        Write-Host "Created junction: $screen\public\$linkName -> $target"
    } else {
        Write-Host "Already exists: $screen\public\$linkName"
    }
}

foreach ($s in $frontScreens) {
    Make-Junction $s "g" "grafika"
    Make-Junction $s "v" "videa"
}

foreach ($s in $backScreens) {
    Make-Junction $s "g" "grafika"
    Make-Junction $s "f" "fotografie pro obrazovky"
}

Write-Host "`nDone! Run this script once before starting dev servers."
