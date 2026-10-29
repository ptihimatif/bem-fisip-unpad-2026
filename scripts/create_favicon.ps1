param([string]$Source = "public/assets/bem-fisip-logo.png")
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$sourceImage = [System.Drawing.Image]::FromFile((Join-Path (Get-Location) $Source))
$iconStream = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter($iconStream)
try {
    $sizes = @(16, 32, 48, 256)
    $payloads = @()
    foreach ($size in $sizes) {
        $bitmap = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $scale = [Math]::Min($size / $sourceImage.Width, $size / $sourceImage.Height)
        $width = [int]($sourceImage.Width * $scale)
        $height = [int]($sourceImage.Height * $scale)
        $graphics.DrawImage($sourceImage, [int](($size - $width) / 2), [int](($size - $height) / 2), $width, $height)
        $pngStream = New-Object System.IO.MemoryStream
        $bitmap.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
        $payloads += ,$pngStream.ToArray()
        $pngStream.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }
    $writer.Write([uint16]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]$sizes.Count)
    $offset = 6 + 16 * $sizes.Count
    for ($index = 0; $index -lt $sizes.Count; $index++) {
        $dimension = $sizes[$index] % 256
        $writer.Write([byte]$dimension)
        $writer.Write([byte]$dimension)
        $writer.Write([byte]0)
        $writer.Write([byte]0)
        $writer.Write([uint16]1)
        $writer.Write([uint16]32)
        $writer.Write([uint32]$payloads[$index].Length)
        $writer.Write([uint32]$offset)
        $offset += $payloads[$index].Length
    }
    foreach ($payload in $payloads) { $writer.Write([byte[]]$payload) }
    $bytes = $iconStream.ToArray()
    [System.IO.File]::WriteAllBytes((Join-Path (Get-Location) "app/favicon.ico"), $bytes)
    [System.IO.File]::WriteAllBytes((Join-Path (Get-Location) "public/assets/favicon.ico"), $bytes)
    Write-Output "Created BEM favicon: 16, 32, 48, 256 pixels; app and legacy public path agree."
} finally {
    $writer.Dispose()
    $iconStream.Dispose()
    $sourceImage.Dispose()
}
