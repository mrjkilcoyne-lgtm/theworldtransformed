---
description: Pre-deployment checklist and verification
---

# Deployment Checklist

Run through this comprehensive pre-deployment checklist:

## 1. Code Quality
- [ ] Build completes successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] All tests passing

## 2. Content Review
- [ ] All blog posts have proper frontmatter
- [ ] No draft posts accidentally included
- [ ] All images and assets load correctly
- [ ] No broken internal links

## 3. SEO & Meta
- [ ] Sitemap generated correctly
- [ ] Meta descriptions present on all pages
- [ ] Open Graph tags configured
- [ ] Robots.txt configured (if needed)

## 4. Git & Version Control
- [ ] All changes committed
- [ ] Commit messages are clear and descriptive
- [ ] No sensitive data in commits (.env, credentials)
- [ ] Branch is up to date with main

## 5. Configuration
- [ ] astro.config.mjs has correct site URL
- [ ] All environment variables documented
- [ ] Build output directory is correct

## 6. Performance
- [ ] Images optimized
- [ ] No unnecessary dependencies
- [ ] Build output size reasonable

## 7. Final Steps
- [ ] Push to remote branch
- [ ] Create pull request
- [ ] Verify GitHub Pages deployment settings

**Action**: Run through each item and report status. Flag any issues that need attention before deployment.
