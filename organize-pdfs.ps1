# organize-pdfs.ps1 - Organize PDFs from Windows folder into docs structure
# Usage: .\organize-pdfs.ps1 [-SourcePath "C:\Users\MatthewKilcoyne\Downloads\_sorted"]

param(
    [string]$SourcePath = "C:\Users\MatthewKilcoyne\Downloads\_sorted"
)

Write-Host "🗂️  PDF Organization Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $SourcePath"
Write-Host "Target: $(Get-Location)\docs"
Write-Host ""

# Check if source directory exists
if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Source directory not found: $SourcePath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage: .\organize-pdfs.ps1 -SourcePath 'C:\path\to\pdfs'"
    exit 1
}

# Count PDFs
$pdfs = Get-ChildItem -Path $SourcePath -Filter "*.pdf" -File -Recurse
$pdfCount = $pdfs.Count

Write-Host "Found $pdfCount PDF files" -ForegroundColor Green
Write-Host ""

if ($pdfCount -eq 0) {
    Write-Host "No PDFs found in $SourcePath"
    exit 0
}

# Create categories menu
Write-Host "Categories available:" -ForegroundColor Yellow
Write-Host "  1) research/economics      - Economic research papers"
Write-Host "  2) research/policy         - Policy analysis"
Write-Host "  3) research/technology     - Tech policy and AI governance"
Write-Host "  4) research/coordination   - Coordination mechanisms"
Write-Host "  5) public/pdfs/research    - Public-facing research (for website)"
Write-Host "  6) public/pdfs/reports     - Public reports (for website)"
Write-Host "  7) public/pdfs/whitepapers - Technical whitepapers (for website)"
Write-Host "  8) Skip/Review later"
Write-Host ""

# Process each PDF
foreach ($pdf in $pdfs) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "📄 $($pdf.Name)" -ForegroundColor Cyan
    Write-Host ""

    # Show file size and date
    Write-Host "Size: $([math]::Round($pdf.Length / 1KB, 2)) KB"
    Write-Host "Modified: $($pdf.LastWriteTime)"
    Write-Host ""

    # Ask for category
    $category = Read-Host "Category (1-8, or 's' to skip)"

    $targetDir = $null
    switch ($category) {
        "1" { $targetDir = "docs\research\economics" }
        "2" { $targetDir = "docs\research\policy" }
        "3" { $targetDir = "docs\research\technology" }
        "4" { $targetDir = "docs\research\coordination" }
        "5" { $targetDir = "public\docs\pdfs\research" }
        "6" { $targetDir = "public\docs\pdfs\reports" }
        "7" { $targetDir = "public\docs\pdfs\whitepapers" }
        { $_ -in "8", "s", "S", "skip" } {
            Write-Host "⏭️  Skipped" -ForegroundColor Yellow
            Write-Host ""
            continue
        }
        default {
            Write-Host "❌ Invalid category, skipping" -ForegroundColor Red
            Write-Host ""
            continue
        }
    }

    # Ask for new filename (optional)
    $newName = Read-Host "Rename to (leave blank to keep '$($pdf.Name)')"
    if ([string]::IsNullOrWhiteSpace($newName)) {
        $newName = $pdf.Name
    } else {
        # Ensure .pdf extension
        if (-not $newName.EndsWith(".pdf")) {
            $newName = "$newName.pdf"
        }
    }

    # Create target directory if it doesn't exist
    $fullTargetDir = Join-Path (Get-Location) $targetDir
    if (-not (Test-Path $fullTargetDir)) {
        New-Item -ItemType Directory -Path $fullTargetDir -Force | Out-Null
    }

    # Copy file
    $targetPath = Join-Path $fullTargetDir $newName
    Copy-Item -Path $pdf.FullName -Destination $targetPath

    Write-Host "✅ Copied to: $targetDir\$newName" -ForegroundColor Green
    Write-Host ""
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Organization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review organized files: ls docs\research\"
Write-Host "  2. Commit changes: git add docs/ public/docs/ && git commit -m 'Add research documents'"
Write-Host "  3. Push to GitHub: git push"
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
