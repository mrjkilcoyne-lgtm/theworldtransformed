#!/bin/bash

# organize-pdfs.sh - Organize PDFs from Windows _sorted folder into docs structure
# Usage: ./organize-pdfs.sh [path-to-sorted-folder]

set -e

SORTED_DIR="${1:-/mnt/c/Users/MatthewKilcoyne/Downloads/_sorted}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🗂️  PDF Organization Script"
echo "=========================="
echo ""
echo "Source: $SORTED_DIR"
echo "Target: $PROJECT_DIR/docs"
echo ""

# Check if source directory exists
if [ ! -d "$SORTED_DIR" ]; then
    echo "❌ Source directory not found: $SORTED_DIR"
    echo ""
    echo "Usage: ./organize-pdfs.sh [path-to-sorted-folder]"
    echo "Example: ./organize-pdfs.sh /mnt/c/Users/MatthewKilcoyne/Downloads/_sorted"
    exit 1
fi

# Count PDFs
pdf_count=$(find "$SORTED_DIR" -name "*.pdf" -type f 2>/dev/null | wc -l)
echo "Found $pdf_count PDF files"
echo ""

if [ "$pdf_count" -eq 0 ]; then
    echo "No PDFs found in $SORTED_DIR"
    exit 0
fi

# Create categories menu
echo "Categories available:"
echo "  1) research/economics      - Economic research papers"
echo "  2) research/policy         - Policy analysis"
echo "  3) research/technology     - Tech policy and AI governance"
echo "  4) research/coordination   - Coordination mechanisms"
echo "  5) public/pdfs/research    - Public-facing research (for website)"
echo "  6) public/pdfs/reports     - Public reports (for website)"
echo "  7) public/pdfs/whitepapers - Technical whitepapers (for website)"
echo "  8) Skip/Review later"
echo ""

# Process each PDF
find "$SORTED_DIR" -name "*.pdf" -type f | while read -r pdf_file; do
    filename=$(basename "$pdf_file")
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 $filename"
    echo ""

    # Try to extract metadata
    if command -v pdfinfo &> /dev/null; then
        title=$(pdfinfo "$pdf_file" 2>/dev/null | grep "^Title:" | cut -d':' -f2- | xargs)
        author=$(pdfinfo "$pdf_file" 2>/dev/null | grep "^Author:" | cut -d':' -f2- | xargs)
        if [ ! -z "$title" ]; then
            echo "Title: $title"
        fi
        if [ ! -z "$author" ]; then
            echo "Author: $author"
        fi
        echo ""
    fi

    # Ask for category
    read -p "Category (1-8, or 's' to skip): " category

    case $category in
        1)
            target_dir="$PROJECT_DIR/docs/research/economics"
            ;;
        2)
            target_dir="$PROJECT_DIR/docs/research/policy"
            ;;
        3)
            target_dir="$PROJECT_DIR/docs/research/technology"
            ;;
        4)
            target_dir="$PROJECT_DIR/docs/research/coordination"
            ;;
        5)
            target_dir="$PROJECT_DIR/public/docs/pdfs/research"
            ;;
        6)
            target_dir="$PROJECT_DIR/public/docs/pdfs/reports"
            ;;
        7)
            target_dir="$PROJECT_DIR/public/docs/pdfs/whitepapers"
            ;;
        8|s|S|skip)
            echo "⏭️  Skipped"
            echo ""
            continue
            ;;
        *)
            echo "❌ Invalid category, skipping"
            echo ""
            continue
            ;;
    esac

    # Ask for new filename (optional)
    read -p "Rename to (leave blank to keep): " new_name
    if [ -z "$new_name" ]; then
        new_name="$filename"
    else
        # Ensure .pdf extension
        if [[ "$new_name" != *.pdf ]]; then
            new_name="${new_name}.pdf"
        fi
    fi

    # Copy file
    mkdir -p "$target_dir"
    cp "$pdf_file" "$target_dir/$new_name"

    echo "✅ Copied to: ${target_dir#$PROJECT_DIR/}/$new_name"
    echo ""
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Organization complete!"
echo ""
echo "Next steps:"
echo "  1. Review organized files: ls -la docs/research/"
echo "  2. Commit changes: git add docs/ public/docs/ && git commit -m 'Add research documents'"
echo "  3. Push to GitHub: git push"
echo ""
