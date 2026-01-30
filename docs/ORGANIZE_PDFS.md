# How to Organize Your PDFs

This guide explains how to organize PDFs from your Windows `_sorted` folder into the project's documentation structure.

## Quick Start (Windows PowerShell - Recommended)

1. **Open PowerShell** in the project directory:
   ```powershell
   cd C:\path\to\theworldtransformed
   ```

2. **Run the organization script**:
   ```powershell
   .\organize-pdfs.ps1
   ```

3. **Follow the prompts** for each PDF:
   - Choose a category (1-8)
   - Optionally rename the file
   - It will be copied to the appropriate folder

## Alternative: Git Bash / WSL

If you're using Git Bash or WSL:

```bash
cd /path/to/theworldtransformed
./organize-pdfs.sh
```

Or specify custom source path:

```bash
./organize-pdfs.sh /mnt/c/Users/MatthewKilcoyne/Downloads/_sorted
```

## Manual Organization

If you prefer to organize manually:

### 1. Understand the Structure

```
docs/
├── research/           # Private research (not published on website)
│   ├── economics/     # Economic papers
│   ├── policy/        # Policy analysis
│   ├── technology/    # Tech policy
│   └── coordination/  # Coordination mechanisms
└── ...

public/docs/pdfs/      # Public documents (accessible on website)
├── research/          # Published research
├── reports/           # Policy reports
└── whitepapers/       # Technical whitepapers
```

### 2. Copy Files

From File Explorer:
- Navigate to `C:\Users\MatthewKilcoyne\Downloads\_sorted`
- Select PDFs
- Copy to appropriate subfolder in project

### 3. Rename (Optional)

Use consistent naming:
```
YYYY-MM-AuthorLastName-ShortTitle.pdf

Examples:
2024-03-Cowen-StateCapacity.pdf
2024-11-ASI-PlanningReform.pdf
2025-01-Hayek-UseOfKnowledge.pdf
```

## Categories Explained

### Research (Private)

**docs/research/economics/**
- Austrian economics papers (Hayek, Mises, Kirzner)
- Public choice theory (Buchanan, Tullock)
- Institutional economics (Coase, Williamson, North)
- Development economics
- Economic policy analysis

**docs/research/policy/**
- Policy briefs and analysis
- Government consultation responses
- Think tank publications
- White papers from policy organizations
- Regulatory analysis

**docs/research/technology/**
- AI governance papers
- Digital sovereignty research
- EU tech regulation analysis (DSA, DMA, AI Act)
- Platform regulation
- Data governance
- Competition policy in tech

**docs/research/coordination/**
- Mechanism design papers
- Collective action theory
- Governance mechanisms
- Smart contracts and binding commitments
- Public goods provision
- Voting systems

### Public Documents (Website Accessible)

**public/docs/pdfs/research/**
- Your own published papers
- Papers you want to share publicly
- Open access research
- Items you want linkable from blog posts

**public/docs/pdfs/reports/**
- Policy reports you've authored
- Public consultation responses
- Published analysis
- Briefing documents

**public/docs/pdfs/whitepapers/**
- Technical specifications
- System architecture documents
- Implementation guides
- Platform documentation (Brunel Engine, Clamour, etc.)

## After Organizing

### 1. Review
```bash
# List what you've added
git status

# Review the organization
ls docs/research/economics/
ls public/docs/pdfs/
```

### 2. Commit to Git
```bash
git add docs/ public/docs/
git commit -m "Add research documents and policy papers"
git push
```

### 3. Access on Website

Public documents will be accessible at:
```
https://theworldtransformed.org/docs/pdfs/research/filename.pdf
https://theworldtransformed.org/docs/pdfs/reports/filename.pdf
https://theworldtransformed.org/docs/pdfs/whitepapers/filename.pdf
```

## Git LFS for Large Files

If you have many large PDFs (total >100MB), use Git LFS:

```bash
# Install Git LFS
git lfs install

# Track PDF files
git lfs track "*.pdf"

# Commit the tracking configuration
git add .gitattributes
git commit -m "Configure Git LFS for PDFs"

# Now add your PDFs
git add docs/ public/docs/
git commit -m "Add research documents via Git LFS"
git push
```

## Tips

### Finding Papers Later

```bash
# Search by keyword
grep -r "mechanism design" docs/research/

# List all PDFs
find docs/ -name "*.pdf" | sort

# Find recent additions (last 7 days)
find docs/ -name "*.pdf" -mtime -7
```

### Creating Reading Lists

Create markdown files to organize related papers:

**docs/research/reading-lists/austrian-economics.md**
```markdown
# Austrian Economics Reading List

## Core Works
- [The Use of Knowledge in Society](../economics/1945-Hayek-UseOfKnowledge.pdf) - Hayek
- [Economic Calculation](../economics/1920-Mises-EconomicCalculation.pdf) - Mises

## Modern Applications
- [Emergent Ventures](../economics/2024-Cowen-EmergentVentures.pdf) - Cowen
```

### Backing Up

Your PDFs are automatically backed up via:
1. Git repository (GitHub)
2. Git LFS (for large files)
3. Vercel deployment (public docs)

Additional backup:
```bash
# Create local archive
tar -czf docs-backup-$(date +%Y%m%d).tar.gz docs/ public/docs/
```

## Troubleshooting

### "File too large for git"

Use Git LFS (see above) or compress the PDF:
```bash
# Install ghostscript
# Windows: choco install ghostscript
# Linux: apt install ghostscript

# Compress PDF
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=output.pdf input.pdf
```

### "Permission denied" on script

Make it executable:
```bash
chmod +x organize-pdfs.sh
```

Windows: Right-click → Properties → Unblock

### "Can't find _sorted folder"

Update the path in the script or pass it as argument:
```powershell
.\organize-pdfs.ps1 -SourcePath "C:\Users\MatthewKilcoyne\Downloads\_sorted"
```

## Questions?

See main docs/README.md for more information or check CLAUDE.md for project context.

---

**Last Updated:** 2026-01-30
