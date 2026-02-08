# Production Deployment Configuration

## 🌐 Live Application URLs

### Frontend (Vercel)
**URL**: https://superbowl-2026.vercel.app/

### Backend (Render.com)
**URL**: https://superbowl-2026.onrender.com/

## 📋 Environment Variables

### Frontend (Vercel)
Set in Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://superbowl-2026.onrender.com
```

**Important**: Redeploy frontend after updating environment variables!

### Backend (Render.com)
Set in Render Dashboard → Environment:

```env
MONGODB_URI=mongodb+srv://blakeflyz1_db_user:REkE0JzAuMQUWZNU@cluster0.fh6dmbp.mongodb.net/superbowl2026?retryWrites=true&w=majority&appName=Cluster0
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://superbowl-2026.vercel.app
```

## 🔍 Verification Steps

### 1. Backend Health Check
```bash
curl https://superbowl-2026.onrender.com/health
```
Expected: `{"status":"ok","timestamp":"..."}`

**Note**: Render free tier may take 30-60 seconds to spin up if inactive.

### 2. Backend API Info
```bash
curl https://superbowl-2026.onrender.com/
```
Expected: JSON with API documentation

### 3. Get Vote Counts
```bash
curl https://superbowl-2026.onrender.com/api/votes
```
Expected:
```json
{
  "patriots": 0,
  "seahawks": 0,
  "total": 0,
  "percentages": {
    "patriots": 0,
    "seahawks": 0
  }
}
```

### 4. Test Vote Submission
```bash
curl -X POST https://superbowl-2026.onrender.com/api/votes \
  -H "Content-Type: application/json" \
  -d '{"team":"patriots"}'
```

### 5. Frontend Access
Visit: https://superbowl-2026.vercel.app/

Expected:
- ✅ Page loads successfully
- ✅ Countdown timer is running
- ✅ Team cards are visible
- ✅ Vote counts load from backend
- ✅ Voting functionality works

## 🚀 Deployment Instructions

### Frontend (Vercel)

#### Initial Deployment
1. Go to https://vercel.com/new
2. Import GitHub repository: `SystemInfomation/Superbowl-2026`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://superbowl-2026.onrender.com`
5. Click **Deploy**

#### Subsequent Deployments
Vercel automatically deploys on every push to the main branch.

To manually deploy:
1. Go to Vercel Dashboard
2. Select project
3. Click **Redeploy**

### Backend (Render.com)

#### Initial Deployment
1. Go to https://render.com/
2. Click **New +** → **Web Service**
3. Connect GitHub repository: `SystemInfomation/Superbowl-2026`
4. Configure service:
   - **Name**: `superbowl-2026`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)
5. Add Environment Variables (see above)
6. Click **Create Web Service**

#### Subsequent Deployments
Render automatically deploys on every push to the main branch.

To manually deploy:
1. Go to Render Dashboard
2. Select service
3. Click **Manual Deploy** → **Deploy latest commit**

## 📊 MongoDB Atlas Configuration

### Connection String
```
mongodb+srv://blakeflyz1_db_user:REkE0JzAuMQUWZNU@cluster0.fh6dmbp.mongodb.net/superbowl2026?retryWrites=true&w=majority&appName=Cluster0
```

### Verify Database
1. Log in to MongoDB Atlas: https://cloud.mongodb.com/
2. Navigate to Database → Browse Collections
3. Database: `superbowl2026`
4. Collection: `votes`
5. You should see vote documents as users vote

### IP Whitelist
Ensure `0.0.0.0/0` is in the IP Access List to allow connections from Render.com.

## 🛠️ Troubleshooting

### Backend Not Responding (Render Free Tier)
**Issue**: First request times out or takes >30 seconds

**Cause**: Render free tier spins down after 15 minutes of inactivity

**Solution**: 
- Wait 30-60 seconds for service to spin up
- Consider upgrading to paid tier for always-on service
- Or set up a cron job to ping the backend every 10 minutes

### CORS Errors
**Issue**: Frontend can't reach backend

**Solution**:
1. Verify `FRONTEND_URL` in Render environment variables matches Vercel URL exactly
2. Check CORS configuration in `backend/src/index.js`
3. Ensure no trailing slashes in URLs

### MongoDB Connection Failed
**Issue**: Backend logs show MongoDB connection error

**Solution**:
1. Verify `MONGODB_URI` is correct in Render environment variables
2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Verify database user credentials
4. Ensure cluster is running (not paused)

### Frontend Shows Old Data
**Issue**: Vote counts don't update

**Solution**:
1. Clear browser cache and reload
2. Verify backend is running and accessible
3. Check browser console for API errors
4. Verify `NEXT_PUBLIC_API_URL` environment variable in Vercel

### Votes Not Saving
**Issue**: Voting appears to work but counts don't increase

**Solution**:
1. Check backend logs in Render dashboard
2. Verify MongoDB connection is successful
3. Check database permissions in MongoDB Atlas
4. Review browser console for error messages

## 🔐 Security Considerations

### Environment Variables
- ✅ MongoDB credentials stored in environment variables (not in code)
- ✅ API URL configurable per environment
- ⚠️ **DO NOT** commit `.env` files to Git

### CORS
- ✅ CORS configured to allow only specific frontend origin
- ⚠️ Update `FRONTEND_URL` if frontend domain changes

### Rate Limiting
- ⚠️ No rate limiting currently implemented
- 📝 Consider adding for production (e.g., `express-rate-limit`)

### IP Deduplication
- ✅ IP hashing code available (currently commented out)
- 📝 Uncomment in `backend/src/routes/votes.js` if needed

## 📈 Monitoring

### Render Dashboard
- Monitor service health
- View logs in real-time
- Check memory/CPU usage
- Set up alerts for downtime

### Vercel Analytics
- Enable Vercel Analytics for frontend metrics
- Monitor page load times
- Track user visits

### MongoDB Atlas
- Monitor database size
- Set up alerts for connection issues
- Review query performance

## 🔄 Update Process

### Code Changes
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Both Vercel and Render auto-deploy

### Environment Variable Changes
1. **Frontend**: Update in Vercel Dashboard → Redeploy
2. **Backend**: Update in Render Dashboard → Redeploy

### Database Schema Changes
1. Test locally first
2. Consider migration strategy
3. Deploy backend changes
4. Monitor for errors

## 📝 Maintenance Checklist

Weekly:
- [ ] Check backend uptime (Render dashboard)
- [ ] Verify vote counts are incrementing
- [ ] Review error logs
- [ ] Test voting functionality

Monthly:
- [ ] Review MongoDB storage usage
- [ ] Check for dependency updates
- [ ] Review security advisories
- [ ] Backup MongoDB data (if needed)

## 🎯 Performance Optimization

### Frontend
- ✅ Next.js automatic code splitting
- ✅ Image optimization
- ✅ SWR caching and revalidation
- 📝 Consider enabling Vercel Edge Network

### Backend
- ✅ MongoDB indexing (add if needed)
- 📝 Consider Redis caching for vote counts
- 📝 Implement response compression

## 📞 Support

For issues with:
- **Deployment**: Check Vercel/Render documentation
- **MongoDB**: MongoDB Atlas support
- **Code**: Review [TESTING.md](./TESTING.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)
