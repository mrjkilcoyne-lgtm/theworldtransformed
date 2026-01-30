# How to Organize Your PDFs from Windows _sorted Folder

**Quick guide to organizing your research PDFs into the project structure.**

---

## What's Been Set Up

✅ **Complete folder structure** for research and policy documents
✅ **Automated scripts** to help you organize PDFs
✅ **Clear categorization** (economics, policy, technology, coordination)
✅ **Public vs private** separation
✅ **Naming conventions** and best practices

---

## Quick Start (Windows)

### Option 1: PowerShell Script (Recommended)

1. **Open PowerShell** in project directory:
   ```powershell
   cd C:\path\to\theworldtransformed
   ```

2. **Run the script**:
   ```powershell
   .\organize-pdfs.ps1
   ```

3. **Follow prompts** for each PDF:
   - Choose category (economics, policy, tech, coordination)
   - Optionally rename
   - File gets copied to right folder

4. **Done!** Your PDFs are now organized

### Option 2: Manual (Drag & Drop)

Just drag PDFs from `C:\Users\MatthewKilcoyne\Downloads\_sorted` into:

```
docs/research/
├── economics/      - Austrian economics, public choice, etc.
├── policy/         - Policy analysis and briefs
├── technology/     - AI governance, tech policy
└── coordination/   - Mechanism design, collective action
```

Or for public documents (accessible on website):

```
public/docs/pdfs/
├── research/       - Published research papers
├── reports/        - Policy reports
└── whitepapers/    - Technical documentation
```

---

## Folder Structure Explained

### Private Research (docs/research/)

**docs/research/economics/**
- Austrian economics (Hayek, Mises, Kirzner)
- Public choice theory (Buchanan, Tullock)
- Institutional economics (Coase, Williamson, North)
- Economic policy analysis

**docs/research/policy/**
- Policy briefs
- Think tank publications
- Government responses
- Regulatory analysis

**docs/research/technology/**
- AI governance
- Digital sovereignty
- EU tech regulation (DSA, DMA, AI Act)
- Platform regulation

**docs/research/coordination/**
- Mechanism design
- Collective action theory
- Governance mechanisms
- Smart contracts

### Public Documents (public/docs/pdfs/)

Files here become accessible at:
```
https://theworldtransformed.org/docs/pdfs/research/filename.pdf
https://theworldtransformed.org/docs/pdfs/reports/filename.pdf
```

Use for:
- Your published papers
- Papers to share publicly
- Reports you want to link from blog posts

---

## Naming Convention (Optional but Recommended)

```
YYYY-MM-AuthorLastName-ShortTitle.pdf

Examples:
2024-03-Cowen-StateCapacityLibertarianism.pdf
2024-11-ASI-PlanningReformProposal.pdf
1945-09-Hayek-UseOfKnowledge.pdf
```

Benefits:
- Easy to find by date
- Sortable chronologically
- Clear at a glance

---

## After Organizing

### Commit to Git

```bash
git add docs/ public/docs/
git commit -m "Add research papers and policy documents"
git push
```

### If You Have Many Large PDFs (>100MB total)

Use Git LFS:

```bash
git lfs install
git lfs track "*.pdf"
git add .gitattributes
git commit -m "Configure Git LFS for PDFs"
```

Then add your PDFs as normal.

---

## Full Documentation

For complete details, see:
- **[docs/ORGANIZE_PDFS.md](./docs/ORGANIZE_PDFS.md)** - Complete guide
- **[docs/README.md](./docs/README.md)** - Documentation structure
- **[organize-pdfs.ps1](./organize-pdfs.ps1)** - PowerShell script
- **[organize-pdfs.sh](./organize-pdfs.sh)** - Bash script

---

## What This Enables

Once organized, you can:
- **Search**: `grep -r "mechanism design" docs/`
- **Link from blog**: Reference public PDFs in posts
- **Build resources page**: List research by category
- **Track reading**: Create reading lists in docs/
- **Share with others**: Public PDFs accessible via website

---

## Questions?

Everything is documented in the `docs/` folder. Start with [docs/README.md](./docs/README.md) for the overview.

---

**Current Status:**
✅ Folder structure created
✅ Scripts ready to use
✅ Documentation complete
✅ All committed and pushed

**Your turn:** Run `.\organize-pdfs.ps1` to start organizing!

**Source folder:** `C:\Users\MatthewKilcoyne\Downloads\_sorted`
