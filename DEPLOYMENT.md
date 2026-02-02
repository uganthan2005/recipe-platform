# Deploying Recipe Platform to Render

## Overview

This guide covers deploying the Recipe Platform to Render with:
- **Backend**: Node.js/Express API as a Web Service
- **Frontend**: React/Vite app as a Static Site
- **Database**: MongoDB Atlas (external)

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user with password
4. **Important**: Whitelist all IPs (`0.0.0.0/0`) for Render access

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://username:password@cluster.mongodb.net/recipe-platform`

---

## Step 2: Push to GitHub

```bash
# If not already done
git remote add origin https://github.com/YOUR_USERNAME/recipe-platform.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `recipe-platform` repository

### 3.2 Configure Backend Service

**Basic Settings:**
- **Name**: `recipe-platform-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main` (or `master`)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

**Instance Type:**
- Select **Free** tier

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secret-key-here` | Generate a random string (min 32 chars) |
| `GEMINI_API_KEY` | `your-gemini-api-key` | From Google AI Studio |
| `PORT` | `5000` | Render will override this, but keep it |
| `NODE_ENV` | `production` | Optional but recommended |

> **Security Tip**: Use a password generator for `JWT_SECRET`

### 3.4 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://recipe-platform-backend.onrender.com`

---

## Step 4: Update Frontend for Production

### 4.1 Create Environment Configuration

Create `frontend/.env.production`:

```env
VITE_API_URL=https://recipe-platform-backend.onrender.com
```

### 4.2 Update API Base URL

The frontend should already use environment variables. Verify in `frontend/src/main.jsx` or axios configuration:

```javascript
// Should look like this
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

If not present, add this configuration.

---

## Step 5: Deploy Frontend to Render

### 5.1 Create Static Site
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select same GitHub repository
3. Configure:

**Basic Settings:**
- **Name**: `recipe-platform-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 5.2 Add Environment Variable

Add environment variable:
- **Key**: `VITE_API_URL`
- **Value**: `https://recipe-platform-backend.onrender.com` (your backend URL)

### 5.3 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment
3. Your app will be live at: `https://recipe-platform-frontend.onrender.com`

---

## Step 6: Configure CORS in Backend

Update `backend/index.js` to allow your frontend domain:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://recipe-platform-frontend.onrender.com' // Add your Render frontend URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commit and push this change - Render will auto-redeploy.

---

## Step 7: Seed Database (Optional)

### Option 1: Run Seed Script Locally
```bash
# In backend directory
MONGO_URI="your-production-mongodb-uri" node seed.js
```

### Option 2: Use Render Shell
1. Go to your backend service in Render
2. Click **"Shell"** tab
3. Run: `node seed.js`

---

## Step 8: Test Your Deployment

1. Visit your frontend URL: `https://recipe-platform-frontend.onrender.com`
2. Try to register a new account
3. Test login
4. Create a recipe
5. Test meal planner
6. Verify all features work

---

## Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds (cold start)
- **Solution**: Consider upgrading to paid tier for production use

### Auto-Deploy
- Render automatically redeploys when you push to GitHub
- Monitor deployments in the Render dashboard

### Custom Domain (Optional)
1. Go to your service settings
2. Click **"Custom Domain"**
3. Add your domain and follow DNS instructions

---

## Troubleshooting

### Backend Won't Start
- Check environment variables are set correctly
- View logs in Render dashboard
- Verify MongoDB connection string

### Frontend Can't Connect to Backend
- Check `VITE_API_URL` is set correctly
- Verify CORS configuration in backend
- Check browser console for errors

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

### Cold Start Issues
- Free tier services sleep after inactivity
- First request takes longer
- Consider using a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 5 minutes

---

## Environment Variables Summary

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-platform
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
GEMINI_API_KEY=your-google-gemini-api-key
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://recipe-platform-backend.onrender.com
```

---

## Next Steps

1. ✅ Set up monitoring (Render provides basic monitoring)
2. ✅ Configure custom domain (optional)
3. ✅ Set up automated backups for MongoDB
4. ✅ Consider upgrading to paid tier for better performance
5. ✅ Add error tracking (e.g., Sentry)

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Cost Estimate

- **Render Free Tier**: $0/month (with limitations)
- **MongoDB Atlas M0**: $0/month (512MB storage)
- **Google Gemini API**: Free tier available

**Total**: $0/month for development/testing

For production, consider:
- Render Starter: $7/month per service
- MongoDB Atlas M10: $0.08/hour (~$57/month)
