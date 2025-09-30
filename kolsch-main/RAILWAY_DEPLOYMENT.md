# Railway Deployment Guide

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with your GitHub account (recommended)

## Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `dmcsparren-rd-mentorship-2025` repository
4. Select the `kolsch-main` directory as the root

## Step 3: Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically:
   - Create the database
   - Set the `DATABASE_URL` environment variable
   - Connect it to your app

## Step 4: Configure Environment Variables
1. Click on your service (not the database)
2. Go to "Variables" tab
3. Add these variables:

```
SESSION_SECRET=generate-a-random-32-character-string-here
NODE_ENV=production
```

Optional (if using Claude AI features):
```
ANTHROPIC_API_KEY=your-api-key
```

**Note**: `DATABASE_URL` and `PORT` are automatically set by Railway.

## Step 5: Run Database Migration
1. In Railway, click on your service
2. Go to "Settings" tab
3. Scroll to "Deploy" section
4. Add this to "Custom Start Command":
```
npm run db:push && npm start
```

This will run migrations before starting the server.

## Step 6: Deploy
1. Railway auto-deploys when you push to GitHub
2. Or click "Deploy" in Railway dashboard
3. Wait 2-5 minutes for build to complete

## Step 7: Get Your URL
1. Go to "Settings" tab in your service
2. Under "Domains", click "Generate Domain"
3. You'll get a URL like: `your-app.up.railway.app`

## Step 8: Connect Your Custom Domain (Optional)
1. In Railway service settings → "Domains"
2. Click "Custom Domain"
3. Enter your domain (e.g., `brewery.yourdomain.com`)
4. Railway will provide DNS records
5. Go to AWS Route 53:
   - Create a CNAME record pointing to Railway's domain
   - Or use the provided A records

## Deployment Commands (Future Updates)
After initial setup, just push to GitHub:
```bash
git add .
git commit -m "your changes"
git push origin main
```

Railway will automatically rebuild and redeploy.

## Monitoring & Logs
- View logs: Railway dashboard → Service → "Logs" tab
- View metrics: Railway dashboard → Service → "Metrics" tab
- Database access: Railway dashboard → Database → "Connect"

## Troubleshooting

### Build fails
- Check "Logs" tab in Railway
- Verify all dependencies in package.json
- Ensure build script works locally: `npm run build`

### App crashes on start
- Check environment variables are set
- Verify DATABASE_URL is connected
- Check logs for error messages

### Database connection errors
- Ensure PostgreSQL service is running
- Check DATABASE_URL variable exists
- Run migrations: `npm run db:push`

## Cost
- **Free Tier**: 500 hours/month, 512MB RAM, 1GB storage
- Enough for testing and small projects
- Scales automatically if you upgrade

## Need Help?
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway