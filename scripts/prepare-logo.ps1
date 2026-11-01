Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Bitmap]::FromFile("public/assets/brand/tetra-logo.png")
$width = $source.Width
$height = $source.Height

# Create a white variant where black/dark pixels turn to white, but blue and transparent remain
$whiteLogo = New-Object System.Drawing.Bitmap($width, $height)

for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $pixel = $source.GetPixel($x, $y)
        if ($pixel.A -gt 15) {
            # Check if this pixel is blueish (B > R and B > 120 and R < 100)
            if ($pixel.B -gt 140 -and $pixel.R -lt 100) {
                # Preserve electric blue
                $whiteLogo.SetPixel($x, $y, $pixel)
            } else {
                # Dark / black pixel -> make it pure white with preserved alpha
                $newColor = [System.Drawing.Color]::FromArgb($pixel.A, 255, 255, 255)
                $whiteLogo.SetPixel($x, $y, $newColor)
            }
        } else {
            $whiteLogo.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$whiteLogo.Save("public/assets/brand/tetra-logo-white.png", [System.Drawing.Imaging.ImageFormat]::Png)
$whiteLogo.Dispose()
$source.Dispose()
Write-Host "Created tetra-logo-white.png successfully!"
