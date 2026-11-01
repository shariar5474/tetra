Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Bitmap]::FromFile("public/assets/brand/reference-full.jpg")

function Crop-Img($x, $y, $w, $h, $dest) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $source.Clone($rect, $source.PixelFormat)
    $cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Saved $dest"
}

Crop-Img 45 10 100 24 "public/assets/brand/navbar-logo-ref.png"
Crop-Img 65 832 95 30 "public/assets/brand/cta-logo-ref.png"
Crop-Img 45 885 95 28 "public/assets/brand/footer-logo-ref.png"

$source.Dispose()
