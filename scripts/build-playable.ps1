$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$outputPath = Join-Path $projectRoot 'youtube-playable.zip'
$bundleItems = @(
    (Join-Path $projectRoot 'index.html'),
    (Join-Path $projectRoot 'main.js'),
    (Join-Path $projectRoot 'assets'),
    (Join-Path $projectRoot 'scenes'),
    (Join-Path $projectRoot 'utils'),
    (Join-Path $projectRoot 'vendor')
)

Compress-Archive -LiteralPath $bundleItems -DestinationPath $outputPath -CompressionLevel Optimal -Force
Write-Output "Created $outputPath"
