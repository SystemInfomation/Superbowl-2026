# Super Bowl LX (2026) - Deployment Guide

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Import Project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`

4. **Deploy**
   - Click "Deploy" and wait for build to complete

**Alternative (Root Directory):**
If you're deploying from the monorepo root, you can:
- Keep Root Directory as `.` (root)
- The `vercel.json` file will handle the routing to `/frontend`

### Option 2: Netlify

1. **Import Project on Netlify**
   - Go to [app.netlify.com/start](https://app.netlify.com/start)
   - Import your GitHub repository

2. **Configure Build Settings** (auto-configured via netlify.toml)
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`

3. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`

4. **Deploy**

## Backend Deployment

### Render.com (Recommended for Node.js + MongoDB)

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `superbowl-2026-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: `4000` (or leave empty, Render will assign)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`

4. **Deploy**
   - Click "Create Web Service"

5. **Copy Backend URL**
   - Once deployed, copy the URL (e.g., `https://superbowl-2026-api.onrender.com`)
   - Update the frontend's `NEXT_PUBLIC_API_URL` environment variable

### Alternative: Railway

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure**
   - **Root Directory**: `backend`
   - Add environment variables as above

## MongoDB Setup

### MongoDB Atlas (Free Tier)

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free M0 cluster

2. **Create Database User**
   - Database Access → Add New Database User
   - Username/Password authentication

3. **Whitelist IP**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password

## Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] MongoDB connected successfully
- [ ] Frontend deployed
- [ ] Frontend can reach backend API
- [ ] Test voting functionality
- [ ] Verify countdown timer
- [ ] Check responsive design on mobile

## Troubleshooting

### "No Next.js version detected" Error

This error occurs when deploying a monorepo. Solutions:

1. **Set Root Directory**: Set the Root Directory to `frontend` in your deployment platform
2. **Use Config Files**: The `vercel.json` or `netlify.toml` files handle this automatically
3. **Verify package.json**: Ensure `next` is in dependencies (it is!)

### CORS Errors

If frontend can't reach backend:
- Verify `FRONTEND_URL` in backend matches your deployed frontend URL
- Check CORS settings in backend/src/index.js

### MongoDB Connection Failed

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user has read/write permissions
