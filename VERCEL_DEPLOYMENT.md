# Vercel Deployment Guide

## 🚀 Deploying to Vercel

This project is now configured for Vercel's serverless platform. Follow these steps to deploy:

### Prerequisites
- A [Vercel account](https://vercel.com/signup) (free tier works)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, but recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel will auto-detect the framework

3. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `NODE_ENV`: `production`
   
4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live! 🎉

### Option 2: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
4. **Add Environment Variables**
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Paste your API key when prompted.

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### 📁 Project Structure for Vercel

```
econ-tutor/
├── api/
│   └── index.ts          # Vercel serverless adapter
├── client/               # Frontend React app
├── server/               # Express server logic
├── vercel.json          # Vercel configuration
└── .vercelignore        # Files to exclude from deployment
```

### 🔧 How It Works

1. **Serverless Adapter** (`api/index.ts`):
   - Wraps your Express app for Vercel's serverless functions
   - Handles initialization and request routing
   - Uses relative imports to avoid path alias issues

2. **Routing** (`vercel.json`):
   - `/api/*` routes → Serverless function (`api/index.ts`)
   - All other routes → Static files (your React app)

3. **Build Process**:
   - Vercel runs `npm run build`
   - Outputs to `dist/public` (static files)
   - API routes run as serverless functions

### 🐛 Troubleshooting

**Build Fails with "Cannot find module '@shared/routes'"**
- The `api/index.ts` uses relative imports (`../server/routes`) to avoid this
- If you see this error, check that all imports in `api/index.ts` use relative paths

**API Routes Return 404**
- Check that your `vercel.json` rewrites are correct
- Ensure `api/index.ts` exists and exports a default function

**Environment Variables Not Working**
- Add them in the Vercel dashboard: Project Settings → Environment Variables
- Redeploy after adding variables

**Cold Start Issues**
- First request after inactivity may be slow (serverless cold start)
- Consider upgrading to Vercel Pro for better performance

### 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Express on Vercel Guide](https://vercel.com/guides/using-express-with-vercel)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

### 🎯 Post-Deployment Checklist

- [ ] Verify API endpoints work: `https://your-app.vercel.app/api/chat`
- [ ] Test chat functionality
- [ ] Test podcast generation
- [ ] Test video summaries
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Share your live app! 🚀

---

**Note:** Vercel's free tier includes:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function execution
- Automatic HTTPS
- Global CDN

Perfect for this educational project!
