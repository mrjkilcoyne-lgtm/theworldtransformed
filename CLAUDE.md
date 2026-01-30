# The World Transformed - Project Context

> Project memory for Claude Code sessions. This file provides context about the codebase, conventions, and common workflows.

## Project Overview

This is Matt Kilcoyne's professional website and blog, focusing on economics, technology policy, philosophy, and coordination mechanisms. The site also serves as the platform for The Brunel Engine and related tools.

**Key Concepts:**
- **The Brunel Engine**: A structured interview tool that generates private reports to help users turn frustrations into actionable insights
- **Clamour**: Public policy wind tunnel (future development)
- **Claimer**: Binding mechanism design layer (future development)

## Tech Stack

- **Framework**: Astro 4.x (static site generator)
- **Content**: MDX (Markdown + JSX)
- **Sitemap**: @astrojs/sitemap 3.2.x for SEO (**do not upgrade to 3.7+ — incompatible with Astro 4.x, crashes on missing `_routes` param**)
- **Deployment**: Vercel (static), with GitHub integration for auto-deploy
- **Repository**: https://github.com/mrjkilcoyne-lgtm/theworldtransformed

## Project Structure

```
theworldtransformed/
├── .claude/                  # Claude Code configuration
│   └── commands/            # Custom slash commands
├── .github/                 # GitHub workflows and docs
│   ├── docs/               # Documentation (CLAMOUR.md, etc.)
│   └── workflows/          # CI/CD and prototypes
├── src/                     # Source code
│   ├── pages/              # Astro pages (routes)
│   │   ├── index.astro     # Homepage
│   │   ├── about.astro     # About page
│   │   ├── brunel.astro    # Brunel Engine landing page
│   │   ├── 404.astro       # Error page
│   │   └── blog/           # Blog routes
│   │       ├── index.astro       # Blog listing
│   │       └── [...slug].astro   # Individual blog posts
│   ├── layouts/            # Page layouts
│   │   ├── BaseLayout.astro      # Master layout (nav, footer, meta)
│   │   └── BlogPostLayout.astro  # Blog post wrapper (date, tags, back link)
│   ├── components/         # Reusable components (not yet populated)
│   └── content/            # Blog posts and content collections
│       ├── config.ts       # Collection schema (title, description, date, tags, draft)
│       └── blog/           # Blog posts in MDX
├── public/                  # Static assets (favicon.svg)
├── astro.config.mjs        # Astro configuration
├── vercel.json             # Vercel deployment config
├── package.json            # Dependencies and scripts
├── CLAUDE.md               # This file - project context for AI
├── llm.txt                 # LLM-readable professional profile
├── BRUNEL.md               # The Brunel Engine specification
└── README.md               # Human-readable project docs
```

## Code Style & Conventions

### File Organization
- **Pages**: Use file-based routing in `src/pages/`
- **Components**: Small, focused, single-responsibility components in `src/components/`
- **Layouts**: Shared page layouts in `src/layouts/`
- **Content**: Blog posts and articles in `src/content/` using content collections

### Naming Conventions
- **Files**: kebab-case for files (`blog-post.astro`, `main-layout.astro`)
- **Components**: PascalCase for component names (`<BlogPost />`, `<MainLayout />`)
- **Variables**: camelCase for variables and functions

### TypeScript
- Use TypeScript for type safety where possible
- Define prop types for all components
- Use Astro's built-in TypeScript support

### Styling
- Prefer scoped styles in `.astro` files
- Use semantic HTML
- Mobile-first responsive design
- Dark theme preference (currently using `github-dark` for code blocks)

### Content Guidelines
- Write for clarity and precision
- Follow Matt's analytical approach: "Follow the money", "Navigation beats prediction"
- Technical accuracy over emotional validation
- Professional, objective tone

## Common Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321
npm run build            # Build for production
npm run preview          # Preview production build

# Future additions (when tests are set up)
npm test                 # Run tests
npm run lint             # Run linter
npm run format           # Format code
npm run type-check       # Check TypeScript types
```

## Git Workflow

**Branch Naming:**
- Feature branches: `claude/feature-name-{sessionId}`
- Bug fixes: `claude/fix-issue-{sessionId}`
- Always include session ID for tracking

**Commit Messages:**
- Clear, descriptive messages
- Focus on "why" rather than "what"
- Include session URL at end
- Example: `Add Brunel Engine interview component\n\nhttps://claude.ai/code/session_xxx`

**Before Committing:**
1. Run `npm run build` to ensure no errors
2. Check git status for unintended files
3. Review diffs carefully
4. Never commit secrets (.env files, credentials)

## Development Patterns

### Creating New Pages
1. Add `.astro` or `.mdx` file to `src/pages/`
2. Use appropriate layout from `src/layouts/`
3. Follow SEO best practices (meta tags, semantic HTML)
4. Test responsive design

### Creating Blog Posts
1. Add `.mdx` file to `src/content/blog/`
2. Include frontmatter: `title` (string), `date` (date), `description` (string), `tags` (string[]), `draft` (boolean, optional)
3. Set `draft: true` to hide from the blog listing
4. Posts are automatically available at `/blog/{filename-without-extension}`
5. Added to sitemap automatically via Astro

### Testing Approach
- **Unit tests**: Components and utilities (Vitest)
- **Integration tests**: Page rendering and data fetching
- **E2E tests**: Critical user flows (Playwright - future)
- Run tests before committing

## Common Issues & Solutions

### Build Errors
- **Missing dependencies**: Run `npm install`
- **TypeScript errors**: Check prop types and imports
- **MDX syntax errors**: Validate MDX syntax, check for unclosed tags
- **Sitemap crash (`Cannot read properties of undefined reading 'reduce'`)**: The `@astrojs/sitemap` version is too new for Astro 4.x. Pin to `3.2.x`. Do NOT use `3.7+` until Astro is upgraded to v5.

### Development Server
- **Port already in use**: Change port in `astro.config.mjs` or kill process
- **Hot reload not working**: Restart dev server
- **Caching issues**: Clear `.astro` cache directory

### Deployment
- **Vercel**: Project uses static output. Vercel auto-detects Astro and runs `npm run build`. No adapter needed for static sites.
- **Build command**: `npm run build` (set automatically by Vercel's Astro detection)
- **Output directory**: `dist/` (Astro default)

## Current Site Routes

All navigation links resolve to working pages:

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Homepage with focus areas, research, principles |
| `/blog` | `src/pages/blog/index.astro` | Blog listing (filters drafts, sorted by date) |
| `/blog/:slug` | `src/pages/blog/[...slug].astro` | Individual blog posts (MDX rendered) |
| `/about` | `src/pages/about.astro` | Professional background and contact |
| `/brunel` | `src/pages/brunel.astro` | Brunel Engine overview ("coming soon") |
| `/404` | `src/pages/404.astro` | Error page |

## Future Enhancements

Priority improvements:
1. ✅ CLAUDE.md and custom commands
2. ✅ Content collections for blog posts (schema + welcome post)
3. ✅ All site pages and routes (blog, about, brunel, 404)
4. ✅ Vercel deployment config
5. ⬜ TypeScript configuration (strict mode configured, paths set up)
6. ⬜ Testing setup (Vitest)
7. ⬜ Linting and formatting (ESLint + Prettier)
8. ⬜ Brunel Engine interactive implementation (React prototype exists in `.github/workflows/prototype/brunel.jsx`)
9. ⬜ Clamour platform development (prototype exists in `.github/workflows/prototype/clamour.jsx`)

## Project-Specific Context

### The Brunel Engine
- Structured interview (6 questions)
- Three tiers: Basic (free), Standard (10p), Council (50p)
- Generates private reports
- Follow-up at 1 month and 1 year
- Entry point to Clamour ecosystem

### Content Focus Areas
- Economics: Institutional economics, Austrian school, market-oriented policy
- Technology Policy: AI governance, digital sovereignty, EU regulation
- Philosophy: Political philosophy, ethics of technology, coordination problems
- Coordination Infrastructure: Mechanism design, collective action

### Key Principles
1. Navigation beats prediction
2. Follow the money
3. People should be able to raise kids in peace
4. All in this together, to the stars and new dimensions

## Resources

- **Official site**: https://theworldtransformed.org
- **Professional work**: https://datainnovation.org/author/mkilcoyne/
- **Twitter/X**: @MattKilcoyne
- **Astro Docs**: https://docs.astro.build
- **MDX Docs**: https://mdxjs.com

---

## Session Log

Key decisions and discoveries across sessions, newest first:

### January 2026 — Fix and complete site
- **Sitemap version constraint discovered**: `@astrojs/sitemap` 3.7.0 crashes with Astro 4.16.x because it references `_routes` in the `astro:build:done` hook, which Astro 4.x doesn't provide. Pinned to 3.2.1.
- **llm.txt had duplicate content**: The entire file was repeated from line 51 onward (copy-paste artifact from an earlier session). Fixed.
- **All nav links now work**: Created `/blog`, `/about`, `/brunel`, `/404` pages. Previously the nav in BaseLayout linked to pages that didn't exist.
- **Blog system is functional**: Content collection schema was already defined but no listing page or post route existed. Both now work with the welcome.mdx post rendering correctly.
- **Vercel deployment configured**: Added `vercel.json` for clean static deployment. No adapter needed — Astro's default static output works.
- **Always run `npm run build` before committing**: The sitemap bug was only visible at build time, not from reading code.

---

**Last Updated**: January 2026

**Maintained by**: Claude Code sessions

**Note**: Update this file when you make significant architectural changes, add new patterns, or discover common pitfalls.
