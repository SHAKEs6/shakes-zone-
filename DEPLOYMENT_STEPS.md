# 🚀 Shakes Zone - Step-by-Step Deployment Guide

## Phase 1: Prepare Your Accounts (5 minutes)

### Step 1.1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" → Create account with email/password
3. Verify your email
4. Accept the terms and create organization

### Step 1.2: Create MongoDB Cluster
1. Click "Create" → Select "Free" tier (M0)
2. Choose "AWS" as provider, select closest region
3. Click "Create Cluster" (wait 1-2 minutes)
4. When created, click "Connect"
5. Choose "Drivers" → Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### Step 1.3: Create MongoDB User
1. In Atlas Dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Create username (e.g., `shakeszone_user`)
4. Create strong password (e.g., randomly generated)
5. **Save these credentials** - you'll need them!
6. Click "Add User"

### Step 1.4: Allow Network Access
1. Go to "Network Access" in Atlas
2. Click "Add IP Address"
3. For testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. **For production**: Whitelist Render's IP later

---

## Phase 2: Prepare Your Project (5 minutes)

### Step 2.1: Update .env File
1. Open `backend/.env` (or create from `.env.example`)
2. Fill in your credentials:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://shakeszone_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shakeszone?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_here
CORS_ORIGIN=https://your-app-name.onrender.com
```

To generate JWT_SECRET, run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2.2: Test Locally (Optional but Recommended)
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Test Connection
curl http://localhost:5000/api/test
# Should respond: {"message":"Backend connection working ✅"}
```

### Step 2.3: Commit Changes
```bash
# DO NOT commit .env file!
# It should already be in .gitignore
git add -A
git commit -m "Configure environment variables"
git push origin main
```

---

## Phase 3: Deploy on Render (10 minutes)

### Step 3.1: Create Render Account
1. Go to https://render.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended for auto-deploy)
4. Authorize GitHub access

### Step 3.2: Connect GitHub Repository
1. In Render Dashboard, click "New +"
2. Select "Web Service"
3. Select "Connect a repository"
4. Find `shakes-zone-` repository
5. Click "Connect"

### Step 3.3: Configure Web Service
1. **Name**: `shakes-zone-backend`
2. **Environment**: Node
3. **Build Command**: `npm install`
4. **Start Command**: `node backend/server.js`
5. **Plan**: Free (or upgrade if needed)
6. Click "Advanced" ↓

### Step 3.4: Add Environment Variables
In "Advanced" section, click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your generated JWT secret |
| `CORS_ORIGIN` | `https://your-service-name.onrender.com` |

⚠️ **Important**: Don't include `CORS_ORIGIN` yet - Render will show you the URL after creation

### Step 3.5: Create Service
1. Click "Create Web Service"
2. Wait for build to complete (2-3 minutes)
3. Check logs to verify it deployed successfully

### Step 3.6: Get Your Render URL
1. Once deployed, Render shows your service URL
2. Format: `https://shakes-zone-backend.onrender.com`
3. **Copy this URL!**

### Step 3.7: Update CORS_ORIGIN
1. In Render Dashboard, click your service
2. Go to "Environment" tab
3. Edit `CORS_ORIGIN` variable
4. Paste your Render URL: `https://shakes-zone-backend.onrender.com`
5. Click "Save"
6. Service will redeploy automatically

---

## Phase 4: Verify Deployment (5 minutes)

### Step 4.1: Test API Endpoint
```bash
curl https://your-service-name.onrender.com/api/test
# Should respond: {"message":"Backend connection working ✅"}
```

### Step 4.2: Test in Browser
1. Open https://your-service-name.onrender.com in browser
2. You should see the Shakes Zone login page
3. Open DevTools (F12) → Console tab
4. Register a new account
5. Login with credentials
6. Check console for WebSocket connection message

### Step 4.3: Verify WebSocket Connection
In browser DevTools → Network tab:
- Look for WebSocket connection (starts with `wss://`)
- Should show as `Connected`
- This means Socket.IO is working

### Step 4.4: Test Real Features
1. Register/Login - should work
2. Dashboard - should load
3. Send game requests - should be realtime
4. All API calls - should return data

---

## Phase 5: Production Checklist (2 minutes)

- [ ] MongoDB cluster is running and accessible
- [ ] Render service is deployed and showing as "Live"
- [ ] API endpoint returns test response
- [ ] Frontend loads without errors
- [ ] Login/Register working
- [ ] WebSocket connection is secure (wss://)
- [ ] `.env` file is NOT in git (check .gitignore)
- [ ] All environment variables are set in Render

---

## 🐛 Troubleshooting

### Service won't deploy
- Check Render logs (Logs tab in dashboard)
- Verify `package.json` exists in root directory
- Ensure Start Command is: `node backend/server.js`

### "Connection refused" error
- Check MongoDB is accessible
- Verify MONGO_URI is correct in Render environment
- Check IP whitelist in MongoDB Atlas

### Frontend can't reach backend
- Verify CORS_ORIGIN in Render matches your URL exactly
- Check `config.js` has correct backend URL
- Ensure frontend config uses `https://` not `http://`

### WebSocket won't connect
- Check browser console for errors
- Verify CORS_ORIGIN in Render is set
- Make sure backend is running (check logs)

### "MongoDB connection error"
- Test connection string locally first
- Verify username/password in MONGO_URI
- Check MongoDB Atlas whitelist includes Render's IP

---

## 📞 Useful Links

- **Render Status**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **View Logs**: Dashboard → Your Service → Logs tab
- **Redeploy**: Dashboard → Your Service → Manual Deploy button

---

## ✅ You're Done!

Your Shakes Zone app is now live on the internet! 🎉

**Live URL**: https://your-service-name.onrender.com
**API URL**: https://your-service-name.onrender.com/api

Share your app with friends and start playing!
