# The Brunel Engine

**Turn frustrations into actionable insight.**

---

## What It Is

A structured interview that generates a private report.

That's it.

You talk to it about your problem. It asks good questions. It generates analysis only you see.

---

## The Flow

```
Welcome → Interview (6 questions) → Tier Select → Report → Follow-up
```

### 1. Welcome
- Sets expectations
- Notes: "This works best when you're serious"
- Privacy: "Only you see the report"

### 2. Interview
Anthropic-style structured questions:

1. **What's the problem?** (Open)
2. **How is it affecting you?** (Impact/cost)
3. **What have you tried?** (Prior attempts)
4. **What constraints exist?** (Non-negotiables)
5. **What does solved look like?** (Ideal state)
6. **Are you serious about this?** (Commitment check)

### 3. Tier Selection

| Tier | Price | What You Get |
|------|-------|--------------|
| Basic | Free | Single model analysis |
| Standard | 10p | Enhanced analysis, multiple perspectives |
| Council | 50p | Multi-model synthesis, contrarian views, strategic consensus |

*Prices cover API costs only. No profit.*

### 4. Report

Private output containing:
- **Summary** of the situation
- **Analysis** (core issue, constraints, readiness)
- **Pathways** (quick win, structural fix, adaptation)
- **Council perspectives** (if paid tier)
- **Next actions** (specific, actionable)

### 5. Follow-up Hooks

**"Sign up to tell me how it went"**
- Registers email for check-ins at:
  - 1 month
  - 1 year
- Tracks outcomes over time

**"Donate later"**
- Link at bottom
- No pressure, just available

---

## Why This Design

### Seriousness Filter
The "are you serious" question isn't gatekeeping—it's calibration. The report adjusts based on readiness. Venting is valid. But acting requires different advice than exploring.

### Private Reports
No one sees this but you. No social pressure. No performance. Just you and the analysis.

### Cheap Paywall
10p/50p covers costs. That's it. Low enough to not matter, high enough to filter noise.

### Long Follow-up
1 month and 1 year check-ins create actual data on what works. Most tools never follow up. This one does.

---

## Technical Notes

### Models
- Basic: Single Claude/GPT call
- Standard: Enhanced prompt, longer output
- Council: Multiple models (Claude, GPT, Gemini) + synthesis layer

### Privacy
- No data stored without explicit consent
- Reports generated client-side where possible
- Follow-up emails only if opted in

### Payments
- Stripe for 10p/50p transactions
- "Donate later" links to Ko-fi/similar

---

## The Substack Angle

This isn't the full Clamour vision. This is the **entry point**.

People don't start with policy wind tunnels. They start with their own problems.

The Brunel Engine is how they discover what's possible. Some will just use it for personal stuff. Some will realize their "personal" problem is actually structural. Those are the ones who'll want Clamour.

**Funnel:**
```
Brunel (personal) → "Wait, this is systemic" → Clamour (public) → "This should be binding" → Claimer
```

---

## What to Write in the Substack

Don't pitch the full vision. Pitch this:

> "I built a tool that asks you good questions about whatever's frustrating you, then generates a private report with actual paths forward.
>
> It costs nothing (or 10p/50p if you want multiple AI perspectives synthesized).
>
> Try it. Tell me how it goes."

That's it. Let people discover the rest.
