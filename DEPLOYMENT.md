# AWS Amplify Deployment Guide

## Prerequisites
- AWS Account with Amplify access
- GitHub repository (recommended) or direct code upload

## Deployment Steps

### 1. Push to GitHub (Recommended)
```bash
git add .
git commit -m "Add Amplify configuration"
git push origin main
```

### 2. Deploy via AWS Amplify Console

1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. **Click "New app" → "Host web app"**
3. **Connect your repository**:
   - Choose GitHub/GitLab/Bitbucket
   - Authorize AWS Amplify
   - Select your repository and branch (main/master)

4. **Configure build settings**:
   - Amplify will auto-detect the `amplify.yml` file
   - Review the build configuration

5. **Set Environment Variables**:
   ```
   JWT_SECRET=your-super-secret-jwt-key-here
   DEMO_EMAIL=demo@example.com
   DEMO_PASSWORD=demo123
   NEXTAUTH_URL=https://your-app-name.amplifyapp.com
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

6. **Deploy**:
   - Click "Save and deploy"
   - Wait for the build to complete (~5-10 minutes)

### 3. Alternative: Direct Upload
If you don't want to use Git:
1. Create a ZIP file of your project (exclude node_modules, .next, .git)
2. In Amplify Console, choose "Deploy without Git provider"
3. Upload your ZIP file

## Important Notes

- **Environment Variables**: Make sure to set all required environment variables in the Amplify Console
- **Domain**: Amplify provides a default domain, but you can add a custom domain later
- **Auto-deployment**: With Git connection, Amplify will auto-deploy on every push to your main branch
- **Build Time**: First deployment takes longer due to dependency installation

## Post-Deployment

1. **Test your application** at the provided Amplify URL
2. **Set up custom domain** (optional) in the Amplify Console
3. **Configure monitoring** and alerts if needed

## Troubleshooting

- Check build logs in the Amplify Console if deployment fails
- Ensure all environment variables are properly set
- Verify your Next.js app builds locally with `npm run build`