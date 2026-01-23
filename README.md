# The World Transformed

**Britain's and then the world's promise fulfilled.**

---

## Thesis

The bottleneck isn't ideas or capital—it's coordination. We have the knowledge. We lack the infrastructure to act on it.

LLMs aren't prediction engines. They're navigation tools through possibility space. The Library of Babel already exists—every true theorem, every viable policy, every workable design. Training builds traversal functions. Prompting specifies constraints on a search.

This reframes everything. We can now find true descriptions that enable coordination at scale.

## The Flywheel

```
New Britain (ideation) → Clamour (structured debate) → Claimer (enforcement)
```

**New Britain**: Surface what's actually possible. Ideas campaigns grounded in navigation, not wishful thinking.

**Clamour**: Stress-test them publicly. Friction is a feature. Split-screen bouts. No algorithmic rage-bait—structured disagreement that produces signal.

**Claimer**: Make commitments enforceable. Agentic contract systems that hold parties to what they said. Words become binding.

Each stage feeds the next. Ideas surface, get tested, become real.

## Why Now

- Frontier models crossed the agentic threshold (December 2024)
- Political window open post-election
- Existing institutions failing visibly—33% of UK infrastructure spending flows to landlords through housing constraints
- The gap between what's possible and what's happening has never been wider

## The Ask

Strategic partnership. Not money yet—alignment.

- Signal boost at launch (New Year)
- Introductions to operators who build
- Stress-testing the model before it goes wide

## The Offer

First-mover positioning on the infrastructure that replaces what's broken.

This is a network play. The people in the room when it launches are the people who shape it.

## Evidence

- Policy Analyst, Center for Data Innovation / ITIF
- Chair, Strategic Trade Advisory Group (STAG) — represents think tanks to UK Government
- Former Deputy Director, Adam Smith Institute
- Former ODI (Tim Berners-Lee's outfit)
- Track record: EuroStack critique, CMA cloud licensing roundtables, DSIT briefings

## Vision

So people can raise kids in peace.

---

*Steward model. Asset-locked. Can't be extracted. Speed now, lock later.*

## Contact

[matt@claimour.com] | [@mrjkilcoyne](https://twitter.com/mrjkilcoyne)

---

## The Brunel Engine

**Turn frustrations into actionable insight** through AI-powered structured interviews.

The Brunel Engine is now live on this site at `/brunel`. It features:
- 6-question structured interview flow
- Three-tier analysis (Basic/Standard/Council)
- AI report generation using Claude
- Stripe payment processing
- Email follow-up system

**Try it:** Visit `/brunel` on the live site

**Documentation:**
- [Setup Guide](./BRUNEL_SETUP.md) - Technical implementation details
- [Deployment Guide](./DEPLOY.md) - How to deploy to production

---

## Development

This site is built with [Astro](https://astro.build) and follows modern development best practices.

### Quick Start

```bash
# Install dependencies
npm install

# Configure environment (copy .env.example to .env and add API keys)
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Production

**Fastest way:**
```bash
./deploy.sh
```

Or see [DEPLOY.md](./DEPLOY.md) for detailed deployment options (Vercel, Netlify, self-hosted).

### Development Workflow

```bash
# Run tests
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# Code quality
npm run lint              # Check linting
npm run lint:fix          # Fix linting issues
npm run format            # Format code
npm run type-check        # TypeScript checking

# Full check (runs before commits)
npm run check             # Run all checks
```

### Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed project documentation, including:
- Architecture and conventions
- Development patterns
- Common workflows
- Custom Claude Code commands

### Custom Commands

This project includes custom Claude Code slash commands for common workflows:
- `/new-post` - Create new blog posts
- `/build-check` - Comprehensive build verification
- `/deploy-check` - Pre-deployment checklist
- `/policy-analysis` - Structured policy analysis template
- `/research-plan` - Deep research mode
- `/brunel-review` - Brunel Engine implementation review
