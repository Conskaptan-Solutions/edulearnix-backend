# 🚀 EduLearnix Complete Deployment Guide
## Firebase Hosting (Frontend) + Render (Backend) + Hostinger Domain

---

## 📋 Prerequisites

- [x] Node.js installed
- [x] Git repository
- [x] MongoDB Atlas database (Already configured)
- [x] Hostinger domain: **edulearnix.in**
- [ ] Firebase account (free)
- [ ] Render account (free)

---

## 🎯 Part 1: Backend Deployment on Render

### Step 1.1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 1.2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   ```
   Name: edulearnix-backend
   Region: Singapore (closest to India for better speed)
   Branch: main (or your default branch)
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

### Step 1.3: Set Environment Variables
Click **"Environment"** tab and add these variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://mdmijanur:Mijanur12345@cluster0.q2zhngv.mongodb.net/edulearnix?retryWrites=true&w=majority
JWT_SECRET=edulearnix_jwt_secret_key_2026_very_secure
CLIENT_URL=https://edulearnix.in
SUPER_ADMIN_NAME=Md Mijanur Molla
SUPER_ADMIN_EMAIL=mdmijanur.molla@edulearnix.com
SUPER_ADMIN_PASSWORD=MijaN@123
```

### Step 1.4: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend URL will be: `https://edulearnix-backend.onrender.com`

### Step 1.5: Initialize Super Admin
1. Go to your Render dashboard → Select service
2. Click **"Shell"** tab
3. Run: `npm run seed`
4. This creates your super admin account

### Step 1.6: Test Backend
Open: `https://edulearnix-backend.onrender.com/api/test`
Should return: `{"message":"API is working!"}`

---

## 🔥 Part 2: Frontend Deployment on Firebase

### Step 2.1: Install Firebase CLI
Open PowerShell and run:
```powershell
npm install -g firebase-tools
```

### Step 2.2: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Project name: `edulearnix` (or any name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2.3: Enable Firebase Hosting
1. In Firebase Console → Click **"Hosting"**
2. Click **"Get started"**
3. Follow the steps (CLI will handle this)

### Step 2.4: Update Firebase Configuration
Open `frontend/.firebaserc` and replace:
```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```
Find your project ID in Firebase Console → Project Settings

### Step 2.5: Build Frontend
In your project root, run:
```powershell
cd frontend
npm run build
```
This creates `frontend/dist` folder with production build

### Step 2.6: Login to Firebase
```powershell
firebase login
```
- Browser will open
- Login with your Google account
- Authorize Firebase CLI

### Step 2.7: Initialize Firebase (if needed)
If not already initialized:
```powershell
firebase init hosting
```
- Select: Use an existing project → edulearnix
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

### Step 2.8: Deploy to Firebase
```powershell
firebase deploy --only hosting
```

You'll get a URL like: `https://edulearnix-xxxxx.web.app`

---

## 🌐 Part 3: Hostinger Domain Configuration

### Step 3.1: Get Firebase Hosting Details
1. Go to Firebase Console → Hosting
2. Click **"Add custom domain"**
3. Enter: `edulearnix.in`
4. Firebase will show you DNS records

### Step 3.2: Configure DNS in Hostinger
1. Login to Hostinger: https://hpanel.hostinger.com
2. Go to **Domains** → Select **edulearnix.in**
3. Click **"DNS / Name Servers"**

### Step 3.3: Add Firebase DNS Records
Firebase will give you two A records. Add them:

**A Records:**
```
Type: A
Name: @
Points to: 151.101.1.195
TTL: 3600

Type: A
Name: @
Points to: 151.101.65.195
TTL: 3600
```

**For www subdomain (optional):**
```
Type: CNAME
Name: www
Points to: edulearnix.in
TTL: 3600
```

### Step 3.4: Add Backend Subdomain (Optional)
If you want `api.edulearnix.in` to point to Render:

```
Type: CNAME
Name: api
Points to: edulearnix-backend.onrender.com
TTL: 3600
```

Then update backend environment variable:
```
CLIENT_URL=https://edulearnix.in
```

### Step 3.5: Verify Domain in Firebase
1. Back to Firebase Console
2. Click **"Verify"** (may take 24-48 hours)
3. Once verified, click **"Connect"**
4. Firebase will provision SSL certificate (automatic)

---

## ✅ Part 4: Final Configuration

### Step 4.1: Update Frontend .env.production
Already configured:
```env
VITE_API_URL=https://edulearnix-backend.onrender.com/api
VITE_APP_URL=https://edulearnix.in
```

### Step 4.2: Update Backend Environment
In Render Dashboard, update:
```env
CLIENT_URL=https://edulearnix.in
```

### Step 4.3: Rebuild Frontend
After backend URL is confirmed:
```powershell
cd frontend
npm run build
firebase deploy --only hosting
```

### Step 4.4: Update CORS in Backend
Your `server.js` already has:
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};
```
This will automatically work with `https://edulearnix.in`

---

## 🧪 Part 5: Testing

### Test Checklist:
- [ ] Backend API: `https://edulearnix-backend.onrender.com/api/test`
- [ ] Frontend: `https://edulearnix.in`
- [ ] User signup/login works
- [ ] Admin dashboard accessible
- [ ] All API calls work (jobs, blogs, courses)
- [ ] File uploads work
- [ ] Super admin can access all features

---

## 🔒 Part 6: Security Recommendations

### 6.1: Environment Variables Security
⚠️ **IMPORTANT:** Never commit these files:
- `backend/.env`
- `frontend/.env.production`

Add to `.gitignore`:
```
.env
.env.production
.env.local
```

### 6.2: Change Default Credentials
After deployment, change:
1. MongoDB password
2. JWT secret
3. Super admin password

### 6.3: Enable Firestore Security (Optional)
If using Firebase features beyond hosting.

---

## 📊 Part 7: Monitoring & Maintenance

### Render Free Tier Limitations:
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month free (enough for one service)

### Solutions for Cold Start:
1. **Upgrade to paid plan** ($7/month) - No cold starts
2. **Use cron job** to ping every 14 minutes:
   - Use cron-job.org or similar
   - Ping: `https://edulearnix-backend.onrender.com/api/test`

### Firebase Hosting Limits:
- **Free Tier:**
  - 10 GB storage
  - 360 MB/day data transfer
  - Free SSL certificate
- Upgrade only if you exceed limits

---

## 🚨 Common Issues & Solutions

### Issue 1: Domain not connecting
**Solution:** Wait 24-48 hours for DNS propagation. Use https://dnschecker.org to verify.

### Issue 2: Backend cold start slow
**Solution:** 
- Upgrade to Render paid plan, or
- Use cron job to keep alive

### Issue 3: CORS errors
**Solution:** Verify `CLIENT_URL` in Render matches your domain exactly

### Issue 4: API not working
**Solution:** 
- Check Render logs: Dashboard → Logs
- Verify all environment variables set correctly

### Issue 5: Build fails
**Solution:**
- Check `package.json` scripts
- Verify Node version compatibility

---

## 📱 Part 8: Deployment Commands Reference

### Frontend Deployment:
```powershell
# Build
cd frontend
npm run build

# Deploy
firebase deploy --only hosting

# Deploy with specific project
firebase deploy --only hosting --project edulearnix
```

### Backend Redeployment:
- Push to GitHub → Render auto-deploys
- Or manual redeploy in Render dashboard

### Quick Update Workflow:
```powershell
# 1. Make changes
# 2. Commit to git
git add .
git commit -m "Update feature"
git push origin main

# 3. Backend auto-deploys via Render

# 4. Rebuild and redeploy frontend
cd frontend
npm run build
firebase deploy --only hosting
```

---

## 💰 Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Hostinger Domain | edulearnix.in | ₹149-699/year |
| MongoDB Atlas | Free Tier (512MB) | ₹0 |
| Render | Free Tier | ₹0 |
| Firebase Hosting | Free Tier | ₹0 |
| **Total Monthly** | | **₹0** |
| **Total Yearly** | | **~₹400-700** (domain only) |

### Paid Upgrade Options (Optional):
- **Render Starter:** $7/month (no cold starts, better performance)
- **MongoDB Atlas M10:** $0.08/hour (~$57/month) for production
- **Firebase Blaze:** Pay as you go (only if exceeding free limits)

---

## 🎓 Next Steps After Deployment

1. **SEO Optimization:**
   - Submit sitemap to Google Search Console
   - Add domain to Bing Webmaster Tools
   - Verify structured data with Google Rich Results Test

2. **Analytics Setup:**
   - Add Google Analytics
   - Set up Firebase Analytics (if needed)

3. **Monitoring:**
   - Set up Render alerts
   - Monitor MongoDB Atlas usage

4. **Backup Strategy:**
   - Enable MongoDB Atlas automated backups
   - Keep local database exports

5. **Performance:**
   - Enable Cloudflare (optional) for CDN
   - Optimize images
   - Enable compression

---

## 📞 Support Resources

- **Firebase Docs:** https://firebase.google.com/docs/hosting
- **Render Docs:** https://render.com/docs
- **Hostinger Support:** https://support.hostinger.com
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas

---

## ✨ Quick Start Summary

```powershell
# 1. Backend (Render)
# → Deploy via dashboard, set environment variables

# 2. Frontend (Firebase)
cd frontend
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting

# 3. Domain (Hostinger)
# → Add A records from Firebase
# → Wait 24-48 hours for DNS

# 4. Test
# → https://edulearnix.in
# → Login as super admin
```

---

**🎉 Congratulations! Your EduLearnix platform is now live!**

---

*Last updated: February 1, 2026*
*Version: 1.0.0*
