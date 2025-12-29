# The Brunel Engine

**Transform frustrations into actionable insight.**

A structured interview tool that generates private, AI-powered reports to help you address problems you're facing.

## Features

- 6-question structured interview
- Three analysis tiers (Basic/Standard/Council)
- Private report generation
- Follow-up tracking at 1 month and 1 year
- Clean, minimal UI focused on clarity

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment on Netlify

### Prerequisites
- A Netlify account
- GitHub repository containing this code

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Brunel Engine app"
   git push origin claude/fix-issue-xzCnt
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Select the `brunel-app` directory as the base directory

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `brunel-app`

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app
   - You'll get a URL like `https://your-app-name.netlify.app`

### Environment Variables (For Future API Integration)

When you're ready to connect real AI APIs, add these in Netlify dashboard:

- `ANTHROPIC_API_KEY` - For Claude API access
- `OPENAI_API_KEY` - For GPT access (Council tier)
- `STRIPE_SECRET_KEY` - For payment processing

## Project Structure

```
brunel-app/
├── app/
│   ├── layout.jsx          # Root layout
│   ├── page.jsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   └── BrunelEngine.jsx     # Main application component
├── public/                  # Static files
├── netlify.toml            # Netlify configuration
└── package.json            # Dependencies
```

## Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **React** - UI components

## Future Enhancements

- Backend API integration for report generation
- Stripe payment processing for paid tiers
- Email service for follow-up tracking
- Database for storing anonymized outcomes data
- Multi-model synthesis for Council tier

## Part of The World Transformed

This is the entry point to the larger Clamour ecosystem:

```
Brunel (personal) → Clamour (public) → Claimer (binding)
```

See the main repository README for the full vision.

## License

Part of The World Transformed project. Asset-locked, steward model.
