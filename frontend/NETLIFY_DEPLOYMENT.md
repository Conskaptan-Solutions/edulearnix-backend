# Netlify Deployment Configuration for Frontend

## Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x

## Environment Variables (Set in Netlify Dashboard)
- `VITE_API_URL` = https://your-backend-domain.onrender.com/api

## netlify.toml Configuration
See the netlify.toml file in this directory

## Deployment Steps:
1. Go to https://netlify.com
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Set Base directory: `frontend`
5. Set Build command: `npm run build`
6. Set Publish directory: `dist`
7. Add environment variable: `VITE_API_URL`
8. Click "Deploy site"

## Post-Deployment:
1. Copy your Netlify URL (e.g., https://your-site.netlify.app)
2. Update backend .env `CLIENT_URL` with this Netlify URL
3. Redeploy backend on Render with updated CLIENT_URL
4. Update frontend .env `VITE_API_URL` with your Render backend URL
5. Redeploy frontend on Netlify

## Custom Domain (Optional):
1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS settings as instructed
