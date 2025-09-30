# AWS Deployment Guide

This guide explains how to deploy your brewery management application to AWS.

## Architecture Overview

Your application consists of:
- **Frontend**: React SPA built with Vite
- **Backend**: Express.js API server with database integration
- **Database**: PostgreSQL (recommend AWS RDS or Neon)

## Recommended AWS Deployment Options

### Option 1: AWS Amplify + AWS App Runner (Recommended)

**Frontend (Static)**: Deploy React app to AWS Amplify
**Backend (Server)**: Deploy Express API to AWS App Runner

#### Steps:

1. **Deploy Frontend to Amplify**:
   - Use the existing `amplify.yml` configuration
   - The frontend will be served as static files

2. **Deploy Backend to App Runner**:
   - Create `apprunner.yaml` in your project root
   - App Runner will handle the Express server

3. **Update Frontend API Base URL**:
   - Point frontend API calls to your App Runner URL

### Option 2: Full Amplify with Serverless Functions

Convert Express routes to AWS Lambda functions using Amplify's serverless backend.

### Option 3: AWS Elastic Beanstalk

Deploy the entire full-stack application as a single unit.

## Environment Variables Setup

### Required Environment Variables:

```bash
# Database
DATABASE_URL=postgres://username:password@host:port/database

# Session Secret
SESSION_SECRET=your-secret-key-here

# Node Environment
NODE_ENV=production

# Port (for App Runner)
PORT=3001
```

### Setting Environment Variables:

#### For AWS Amplify:
1. Go to AWS Amplify Console
2. Select your app → Environment variables
3. Add the variables listed above

#### For AWS App Runner:
1. Go to AWS App Runner Console  
2. Select your service → Configuration → Environment variables
3. Add the variables listed above

## Database Setup

### Option 1: AWS RDS PostgreSQL
1. Create RDS PostgreSQL instance
2. Configure security groups for access
3. Update DATABASE_URL with RDS connection string

### Option 2: Neon PostgreSQL (Recommended for simplicity)
1. Create account at neon.tech
2. Create database
3. Use provided connection string for DATABASE_URL

## Deployment Commands

### For frontend-only Amplify deployment:
```bash
# This will use the current amplify.yml configuration
git add .
git commit -m "Deploy to AWS"
git push origin main
```

### For App Runner backend:
The `apprunner.yaml` file (to be created) will handle the deployment automatically.

## Next Steps

1. Choose your deployment strategy (Option 1 recommended)
2. Set up your database (Neon or RDS)
3. Configure environment variables
4. Test the deployment

Would you like me to implement any of these specific deployment options?