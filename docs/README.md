# Document Organization System

This folder contains research papers, policy documents, and reference materials for The World Transformed project.

## Folder Structure

```
docs/
├── README.md                 # This file
├── research/                 # Research papers and academic sources
│   ├── economics/           # Economic research
│   ├── policy/              # Policy analysis
│   ├── technology/          # Tech policy and AI governance
│   └── coordination/        # Coordination mechanisms
├── brunel/                  # Brunel Engine documentation
│   ├── BRUNEL.md           # Main specification
│   ├── BRUNEL_SETUP.md     # Technical setup
│   └── examples/           # Example interviews and reports
├── clamour/                # Clamour project documentation
│   └── CLAMOUR.md          # Specification
├── architecture/           # Technical architecture docs
│   └── CLAUDE.md           # Project context
├── guides/                 # How-to guides
│   ├── DEPLOY.md           # Deployment guide
│   ├── DEPLOY_NOW.md       # Quick start deployment
│   └── FINAL_STEPS.md      # Production checklist
└── projects/               # Project proposals and vision docs
    └── THE_SEARCH.md       # Original vision

public/docs/                # Public-facing downloadable documents
├── pdfs/                   # PDF files for download
│   ├── research/          # Research papers
│   ├── reports/           # Policy reports
│   └── whitepapers/       # Technical whitepapers
└── presentations/          # Slide decks and presentations
```

## Categories

### Research Papers
Academic papers, think tank publications, and research notes on:
- Economics (Austrian economics, institutional economics, public choice)
- Technology policy (AI governance, digital sovereignty, EU regulation)
- Coordination mechanisms (mechanism design, collective action)
- Political philosophy

### Policy Documents
- Policy briefs
- Government consultation responses
- Regulatory analysis
- Position papers

### Technical Documentation
- Architecture documents
- API specifications
- Implementation guides
- Design documents

### Project Documentation
- Vision documents
- Roadmaps
- Proposals
- Meeting notes

## Naming Conventions

### For Research Papers
```
YYYY-MM-AuthorLastName-ShortTitle.pdf
Example: 2024-03-Cowen-StateCapacityLibertarianism.pdf
```

### For Policy Documents
```
YYYY-MM-Organization-ShortTitle.pdf
Example: 2024-11-ASI-PlanningReform.pdf
```

### For Project Documents
```
project-name-document-type.md
Example: brunel-engine-specification.md
```

## How to Add Documents

### From Windows `_sorted` folder:

1. **Identify category** (research, policy, technical, project)
2. **Choose appropriate subfolder**
3. **Rename file** following naming conventions
4. **Copy to project**:
   ```bash
   # From Windows
   cp "C:\Users\MatthewKilcoyne\Downloads\_sorted\paper.pdf" /path/to/repo/docs/research/economics/

   # Or from WSL/Git Bash
   cp /mnt/c/Users/MatthewKilcoyne/Downloads/_sorted/paper.pdf ./docs/research/economics/
   ```

### Via Git:

```bash
# Add documents
git add docs/research/economics/*.pdf
git commit -m "Add economic research papers"
git push
```

## Git LFS for Large Files

If you have many large PDFs (>50MB combined), consider using Git LFS:

```bash
# Install Git LFS
git lfs install

# Track PDF files
git lfs track "*.pdf"
git lfs track "*.ppt*"
git lfs track "*.doc*"

# Add .gitattributes
git add .gitattributes
git commit -m "Configure Git LFS for documents"
```

## Making Documents Public

To make documents downloadable from the website:

1. Place in `public/docs/pdfs/`
2. They'll be accessible at `https://yoursite.com/docs/pdfs/filename.pdf`
3. Link from blog posts or dedicated resources page

## Search and Organization

### Finding Documents

```bash
# Search by topic
grep -r "mechanism design" docs/

# List all PDFs
find docs/ -name "*.pdf"

# Find recent additions
find docs/ -name "*.pdf" -mtime -7
```

### Organizing Existing Files

If you have unsorted PDFs, use this script:

```bash
#!/bin/bash
# organize-docs.sh

for file in docs/unsorted/*.pdf; do
  # Extract year from filename or metadata
  year=$(pdfinfo "$file" | grep "CreationDate" | awk '{print $2}' | cut -c1-4)

  # Move based on content (manual review recommended)
  echo "Review: $file"
  read -p "Category (research/policy/technical): " category
  read -p "Subfolder: " subfolder

  mv "$file" "docs/$category/$subfolder/"
done
```

## Maintenance

### Regular Tasks

- **Weekly**: Review new downloads, categorize and add
- **Monthly**: Update README with new categories if needed
- **Quarterly**: Archive outdated documents to `docs/archive/`

### Cleanup

```bash
# Find duplicate files
fdupes -r docs/

# Find large files
find docs/ -type f -size +10M

# Remove empty directories
find docs/ -type d -empty -delete
```

## Integration with Website

### Creating a Resources Page

```astro
---
// src/pages/resources.astro
import BaseLayout from '../layouts/BaseLayout.astro';

const pdfs = await Astro.glob('../public/docs/pdfs/**/*.pdf');
---

<BaseLayout title="Resources">
  <h1>Research & Resources</h1>

  <section>
    <h2>Research Papers</h2>
    {pdfs.filter(p => p.path.includes('research')).map(pdf => (
      <a href={pdf.path}>{pdf.name}</a>
    ))}
  </section>
</BaseLayout>
```

## Backup

Documents are backed up via:
1. Git repository (GitHub)
2. Git LFS for large files
3. Vercel deployment (public docs)

For additional backup:
```bash
# Create archive
tar -czf docs-backup-$(date +%Y%m%d).tar.gz docs/

# Upload to cloud storage
# (configure as needed)
```

## Questions?

See main project README for more information or contact Matt Kilcoyne.

---

**Last Updated:** 2026-01-30

**Maintained by:** Claude Code sessions
