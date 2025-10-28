# 🚀 Deployment Guide

Complete guide for deploying PlayNav to various platforms.

## Table of Contents
- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [Docker](#docker)
- [Self-Hosted](#self-hosted)
- [GitHub Pages](#github-pages)
- [Environment Variables](#environment-variables)

---

## Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Method 1: Deploy via Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/playnav.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your `playnav` repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy via CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # Production deployment
   vercel --prod
   
   # Preview deployment
   vercel
   ```

### Custom Domain

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

### Vercel Configuration

The project includes `vercel.json` with optimal settings:
- Build command: `npm run build`
- Output directory: `.next`
- Framework: Next.js
- Security headers enabled

---

## Netlify

### Deploy via Dashboard

1. **Push to GitHub** (same as Vercel step 1)

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy"

### Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## Docker

### Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Build & Run

```bash
# Build image
docker build -t playnav .

# Run container
docker run -p 3000:3000 playnav

# Or use Docker Compose
docker-compose up -d
```

---

## Self-Hosted

### Prerequisites
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx (optional, for reverse proxy)

### Setup

1. **Clone and Build**:
   ```bash
   git clone https://github.com/yourusername/playnav.git
   cd playnav
   npm install
   npm run build
   ```

2. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**:
   ```bash
   pm2 start npm --name "playnav" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx** (optional):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable SSL with Certbot**:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## GitHub Pages

⚠️ **Not Recommended**: GitHub Pages doesn't support Next.js server-side features.

For static export (limited functionality):

1. Update `next.config.mjs`:
   ```javascript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```

2. Build and deploy:
   ```bash
   npm run build
   npx gh-pages -d out
   ```

---

## Environment Variables

PlayNav doesn't require environment variables by default. If you add analytics or other services:

1. **Create `.env.local`** (for development):
   ```env
   NEXT_PUBLIC_ANALYTICS_ID=your_id_here
   ```

2. **Add to Vercel**:
   - Go to Project Settings → Environment Variables
   - Add variables and their values
   - Redeploy

3. **Add to Netlify**:
   - Go to Site Settings → Environment Variables
   - Add variables and deploy

---

## Post-Deployment Checklist

- [ ] Test all game features
- [ ] Test on mobile devices
- [ ] Test audio (different browsers)
- [ ] Check localStorage persistence
- [ ] Test all navigation routes
- [ ] Verify responsive design
- [ ] Check console for errors
- [ ] Test keyboard and touch controls
- [ ] Verify performance (should be 60 FPS)
- [ ] Test in different browsers
- [ ] Update robots.txt with your domain
- [ ] Add Google Analytics (optional)
- [ ] Set up monitoring (optional)

---

## Performance Optimization

### Vercel Edge Functions (Optional)

Add to `next.config.mjs`:
```javascript
const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
};
```

### CDN Configuration

All assets are automatically served via CDN when deployed to Vercel/Netlify.

---

## Monitoring

### Recommended Tools
- [Vercel Analytics](https://vercel.com/analytics) - Built-in analytics
- [Google Analytics](https://analytics.google.com) - User tracking
- [Sentry](https://sentry.io) - Error tracking
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing

---

## Troubleshooting

### Build Fails

**Issue**: Build fails on deployment

**Solutions**:
```bash
# 1. Check Node version
node --version  # Should be 18+

# 2. Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build

# 3. Check for TypeScript errors
npm run type-check
```

### Audio Not Working

**Issue**: Audio doesn't play after deployment

**Solution**: This is expected on iOS/mobile. Audio requires user interaction. The game handles this automatically.

### 404 on Routes

**Issue**: Direct navigation to routes returns 404

**Solution**: Ensure your hosting platform is configured for SPA routing. Vercel/Netlify handle this automatically.

### Performance Issues

**Issue**: Game runs slowly in production

**Solutions**:
1. Ensure production build is used (`npm run build && npm start`)
2. Check browser console for errors
3. Verify 60 FPS in devtools (Performance tab)
4. Test on different devices/browsers

---

## Support

For deployment issues:
- 📖 [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- 🚀 [Vercel Documentation](https://vercel.com/docs)
- 🌐 [Netlify Documentation](https://docs.netlify.com)
- 💬 [Open an Issue](https://github.com/yourusername/playnav/issues)

---

**Ready to deploy? Let's go! 🚀**


