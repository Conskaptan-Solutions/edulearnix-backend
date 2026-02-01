# EduLearnix - Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### Project Cleanup
- [x] Remove unnecessary batch files (check-admin.bat, fix-orphaned.bat, reset-admin.bat)
- [x] Remove migration scripts folder (all migrations completed)
- [x] Remove Firebase service account JSON file
- [x] Clean up package.json scripts (removed migration commands)
- [x] Create .gitignore files for root, backend, and frontend
- [x] Reset localhost URLs in .env files

### Configuration Files
- [x] Backend .env configured for local development
- [x] Frontend .env configured for local development
- [x] .env.example files created for both backend and frontend
- [x] .env.production files created with production placeholders
- [x] netlify.toml created for frontend SPA routing
- [x] CORS configured to allow Netlify domains

### Build & Test
- [x] Frontend production build tested successfully
- [x] Backend runs without errors locally
- [x] All API endpoints working

## 🚀 Deployment Steps

### Step 1: Backend Deployment on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: edulearnix-backend (or your choice)
   - **Region**: Singapore (closest to India)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable")
   ```
   MONGO_URI=mongodb+srv://mdmijanur:Mijanur12345@cluster0.q2zhngv.mongodb.net/edulearnix?retryWrites=true&w=majority
   JWT_SECRET=edulearnix_jwt_secret_key_2026_very_secure
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.netlify.app (update after frontend deployment)
   SUPER_ADMIN_NAME=Md Mijanur Molla
   SUPER_ADMIN_EMAIL=mdmijanur.molla@edulearnix.com
   SUPER_ADMIN_PASSWORD=MijaN@123
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Copy your backend URL (e.g., https://edulearnix-backend.onrender.com)

6. **Post-Deployment**
   - Open Render shell (from service dashboard)
   - Run: `npm run seed` to create super admin in production DB
   - Test API health: https://your-backend.onrender.com/api/health

### Step 2: Frontend Deployment on Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up/Login with GitHub

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Production branch**: main

4. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     ```
   - Replace with your actual Render backend URL

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment (2-3 minutes)
   - Copy your Netlify URL (e.g., https://edulearnix.netlify.app)

### Step 3: Update CORS (Important!)

1. **Update Backend CLIENT_URL**
   - Go to Render dashboard → Your service → Environment
   - Update `CLIENT_URL` to your actual Netlify URL
   - Example: `https://edulearnix.netlify.app`
   - Click "Save Changes"
   - Service will automatically redeploy

2. **Test Cross-Origin Requests**
   - Visit your Netlify site
   - Try to login or fetch data
   - Check browser console for CORS errors
   - If errors persist, verify CLIENT_URL is correct

### Step 4: Custom Domains (Optional)

#### Backend Custom Domain on Render
1. Go to service Settings → Custom Domain
2. Add your domain (e.g., api.edulearnix.in)
3. Configure DNS as instructed
4. SSL certificate is auto-generated

#### Frontend Custom Domain on Netlify
1. Go to Site settings → Domain management
2. Add custom domain (e.g., www.edulearnix.in)
3. Configure DNS records
4. SSL certificate is auto-enabled

### Step 5: Post-Deployment Testing

1. **Frontend Testing**
   - [ ] Homepage loads correctly
   - [ ] Navigation works
   - [ ] Dark mode toggle functions
   - [ ] Images load properly

2. **Authentication Testing**
   - [ ] Signup works
   - [ ] Login works
   - [ ] Super admin login works
   - [ ] JWT token persists on refresh
   - [ ] Logout works

3. **API Testing**
   - [ ] Jobs page loads data
   - [ ] Resources page loads data
   - [ ] Blog page loads data
   - [ ] Digital products page loads
   - [ ] Mock tests page loads
   - [ ] Courses page loads

4. **Super Admin Testing**
   - [ ] Super admin dashboard accessible
   - [ ] Can approve/reject contributors
   - [ ] Can manage jobs/resources/blogs
   - [ ] Verified badge shows correctly

5. **Contributor Testing**
   - [ ] Create job works
   - [ ] Create resource works
   - [ ] Create blog works
   - [ ] Points increment correctly
   - [ ] Claim reward submission works

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Service not starting
- Check Render logs for errors
- Verify all environment variables are set
- Check MongoDB connection string is correct

**Problem**: CORS errors
- Verify CLIENT_URL matches your Netlify domain
- Check if domain ends with .netlify.app
- Ensure no trailing slash in CLIENT_URL

**Problem**: Database connection failed
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Verify database user credentials
- Check if cluster is active

### Frontend Issues

**Problem**: API calls failing
- Check VITE_API_URL is correct
- Verify backend is running on Render
- Check browser console for errors
- Test API directly: https://your-backend.onrender.com/api/health

**Problem**: Pages not loading
- Check netlify.toml redirects configuration
- Verify dist folder was built correctly
- Check Netlify deploy logs

**Problem**: Environment variables not working
- Rebuild site after adding env vars
- Check variable name starts with VITE_
- Verify no typos in variable names

### Database Issues

**Problem**: Super admin not found
- Run seed script in Render shell: `npm run seed`
- Check MongoDB Atlas to verify user exists
- Verify super admin email matches login attempt

## 📊 Monitoring

### Render Monitoring
- View logs: Service → Logs tab
- Check metrics: Service → Metrics tab
- Set up alerts: Service → Notifications

### Netlify Monitoring
- View analytics: Site → Analytics
- Check deploy logs: Site → Deploys
- Monitor bandwidth: Site → Usage

## 🔄 Continuous Deployment

Both Render and Netlify auto-deploy on git push:

1. Make changes locally
2. Commit and push to main branch
3. Both services auto-detect and deploy
4. Check deploy status on respective dashboards

## 💾 Backup Strategy

### Database Backups
- MongoDB Atlas auto-backups enabled
- Manual backup via Atlas: Clusters → Backup
- Export collections if needed

### Code Backups
- Git repository on GitHub (already backed up)
- Keep local copy updated
- Tag releases for version control

## 🎉 Deployment Complete!

Your EduLearnix platform is now live on:
- **Frontend**: https://your-domain.netlify.app
- **Backend**: https://your-domain.onrender.com
- **Database**: MongoDB Atlas

Share your platform with users and start helping freshers! 🚀
