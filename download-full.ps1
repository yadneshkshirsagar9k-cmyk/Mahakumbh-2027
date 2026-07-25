$urls = @(
  "https://upload.wikimedia.org/wikipedia/commons/0/01/Trimbakeshwar_Shiva_Temple.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7a/Trimbakeshwar_Temple%2C_Nashik.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e4/Trimbakeshwar_Shiva_Temple_2005.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/17/Ram_Kund%2C_Nashik.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/38/Ramkund_Nashik.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7f/Panchavati-Ramkund.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/06/Ellora_Caves_Aurangabad_Maharashtra.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Beautiful_Ellora_Caves.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3d/Ellora_caves!.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/70/Ajanta_Caves%2C_India%2C_Panoramic_view_of_Ajanta_basalt_cliffs_and_caves.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ajanta_Padmapani.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c3/Ajanta_(63).jpg"
)

$destDir = "public\assets\images\tourism"

$names = @(
  "trimbakeshwar_1.jpg", "trimbakeshwar_2.jpg", "trimbakeshwar_3.jpg",
  "ramkund_1.jpg", "ramkund_2.jpg", "ramkund_3.jpg",
  "ellora_1.jpg", "ellora_2.jpg", "ellora_3.jpg",
  "ajanta_1.jpg", "ajanta_2.jpg", "ajanta_3.jpg"
)

for ($i = 0; $i -lt $urls.Length; $i++) {
    $url = $urls[$i]
    $dest = "$destDir\$($names[$i])"
    Write-Host "Downloading $($names[$i])..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" -TimeoutSec 30
        $size = (Get-Item $dest).Length
        Write-Host "Success: $($names[$i]) ($size bytes)"
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Failed $($names[$i]): $_"
    }
}
