Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Bitmap]::FromFile("public/assets/brand/reference-full.jpg")

if (-not (Test-Path "public/assets/extracted")) {
    New-Item -ItemType Directory -Force -Path "public/assets/extracted" | Out-Null
}

function Crop-Img($x, $y, $w, $h, $dest) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $source.Clone($rect, $source.PixelFormat)
    $cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Saved $dest"
}

# Hero right student image
Crop-Img 330 35 345 190 "public/assets/extracted/hero-student.png"

# Course thumbnails
Crop-Img 32 305 148 70 "public/assets/extracted/course-ai.png"
Crop-Img 192 305 148 70 "public/assets/extracted/course-dm.png"
Crop-Img 352 305 148 70 "public/assets/extracted/course-gd.png"
Crop-Img 512 305 148 70 "public/assets/extracted/course-web.png"

# Trophy
Crop-Img 170 595 78 110 "public/assets/extracted/why-trophy.png"

# Trainers
Crop-Img 268 603 90 60 "public/assets/extracted/trainer-1.png"
Crop-Img 370 603 90 60 "public/assets/extracted/trainer-2.png"
Crop-Img 472 603 90 60 "public/assets/extracted/trainer-3.png"
Crop-Img 574 603 90 60 "public/assets/extracted/trainer-4.png"

# Testimonials
Crop-Img 60 758 35 35 "public/assets/extracted/student-1.png"
Crop-Img 263 758 35 35 "public/assets/extracted/student-2.png"
Crop-Img 467 758 35 35 "public/assets/extracted/student-3.png"

$source.Dispose()
