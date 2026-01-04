# 🚀 Azure Backend Deployment Guide

## ✅ Deploy FastAPI Backend to Azure App Service

### Prerequisites:
- Azure account (free tier available)
- GitHub repo: `Ayush-Raj-Chourasia/Hallux`

---

## 📋 Method 1: Deploy via Azure Portal (Easiest)

### Step 1: Create Azure App Service

1. Go to https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Web App"**
4. Click **Create**

### Step 2: Configure Basic Settings

```
Resource Group:     hallux-rg (create new)
Name:              hallux-backend (must be unique)
Publish:           Code
Runtime stack:     Python 3.12
Region:            East US
Operating System:  Linux

App Service Plan:
Pricing:           Free F1 (or Basic B1 for better performance)
```

### Step 3: Configure Deployment

1. Click **Next: Deployment >**
2. Enable **GitHub Actions** deployment
3. Sign in to GitHub
4. Select:
   ```
   Organization: Ayush-Raj-Chourasia
   Repository:   Hallux
   Branch:       main
   ```
5. Click **Next: Networking >** (keep defaults)
6. Click **Next: Monitoring >** (keep defaults)
7. Click **Review + Create**
8. Click **Create**

### Step 4: Configure Application Settings

After deployment completes:

1. Go to your App Service: `hallux-backend`
2. Click **Configuration** (left menu)
3. Click **+ New application setting** for each:

```
OPENAI_API_KEY = your-openai-api-key-here

GOOGLE_API_KEY = your-google-api-key-here

CROSSREF_EMAIL = team@hallux.dev

ENVIRONMENT = production

DEBUG = False

SCM_DO_BUILD_DURING_DEPLOYMENT = true

WEBSITE_RUN_FROM_PACKAGE = 0
```

4. Click **Save** (top bar)
5. Click **Continue** to restart

### Step 5: Configure Startup Command

1. Still in **Configuration**
2. Go to **General settings** tab
3. **Startup Command:** 
   ```bash
   gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120
   ```
4. Click **Save**

### Step 6: Configure Deployment Center

1. Click **Deployment Center** (left menu)
2. Under **Settings**, find **Build provider**
3. Set:
   ```
   Source:        GitHub
   Branch:        main
   Build:         GitHub Actions
   Runtime:       Python 3.12
   App location:  /backend
   ```
4. Click **Save**

---

## 🔄 Method 2: Deploy via Azure CLI (Advanced)

### Install Azure CLI:
```powershell
# Windows (PowerShell)
winget install Microsoft.AzureCLI
```

### Deploy Commands:

```powershell
# Login to Azure
az login

# Create resource group
az group create --name hallux-rg --location eastus

# Create App Service Plan
az appservice plan create `
  --name hallux-plan `
  --resource-group hallux-rg `
  --sku F1 `
  --is-linux

# Create Web App
az webapp create `
  --resource-group hallux-rg `
  --plan hallux-plan `
  --name hallux-backend `
  --runtime "PYTHON:3.12" `
  --deployment-source-url https://github.com/Ayush-Raj-Chourasia/Hallux `
  --deployment-source-branch main

# Configure app settings
az webapp config appsettings set `
  --resource-group hallux-rg `
  --name hallux-backend `
  --settings `
    OPENAI_API_KEY="your-openai-key" `
    GOOGLE_API_KEY="your-gemini-key" `
    ENVIRONMENT="production" `
    DEBUG="False" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true"

# Set startup command
az webapp config set `
  --resource-group hallux-rg `
  --name hallux-backend `
  --startup-file "gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000"
```

---

## 📁 Required Files (Already Created)

### 1. `backend/requirements.txt`
✅ Already updated with `gunicorn==21.2.0`

### 2. `backend/startup.txt`
✅ Created with Azure startup command

### 3. `.github/workflows/azure-deploy.yml` (Optional)
For custom GitHub Actions workflow

---

## 🔗 Get Your Backend URL

After deployment (5-10 minutes):

**Your backend URL:**
```
https://hallux-backend.azurewebsites.net
```

**Health check:**
```
https://hallux-backend.azurewebsites.net/api/health
```

**API Docs:**
```
https://hallux-backend.azurewebsites.net/docs
```

---

## 🎯 Update Frontend (Vercel)

### Step 1: Update Environment Variable

1. Go to Vercel project
2. **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://hallux-backend.azurewebsites.net
   ```
4. Click **Save**

### Step 2: Redeploy Frontend

1. **Deployments** tab
2. Latest deployment → **⋯** → **Redeploy**
3. Uncheck "Use existing Build Cache"
4. Click **Redeploy**

---

## 🧪 Test Your Deployment

### Test Backend:
```powershell
# Health check
curl https://hallux-backend.azurewebsites.net/api/health

# Should return: {"status":"healthy"}
```

### Test Frontend + Backend:
1. Go to your Vercel URL
2. Click "Load Example"
3. Click "Verify Now"
4. Should see verification results!

---

## 🔍 Monitor & Debug

### View Logs:

**Via Portal:**
1. Go to App Service
2. Click **Log stream** (left menu)
3. Watch live logs

**Via CLI:**
```powershell
az webapp log tail --resource-group hallux-rg --name hallux-backend
```

### Check Deployment Status:

1. Go to **Deployment Center**
2. View **Logs** tab
3. Check build and deployment status

---

## ⚠️ Troubleshooting

### Issue: App shows "Application Error"

**Fix:**
1. Check logs in **Log stream**
2. Verify startup command is correct
3. Check all environment variables are set
4. Ensure `gunicorn` is in requirements.txt

### Issue: 502 Bad Gateway

**Fix:**
1. App is starting (wait 2-3 minutes)
2. Check startup command timeout
3. Increase workers if on higher tier: `--workers 4`

### Issue: Import errors

**Fix:**
1. Check `SCM_DO_BUILD_DURING_DEPLOYMENT=true` is set
2. Verify all packages in requirements.txt
3. Redeploy from Deployment Center

### Issue: CORS errors from frontend

**Fix:** Add CORS settings in `backend/app/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 💰 Cost Estimate

**Free Tier (F1):**
- 1 GB RAM
- 60 CPU minutes/day
- 1 GB storage
- Custom domain support
- ✅ Perfect for hackathon demo!

**Basic Tier (B1) - $13.14/month:**
- 1.75 GB RAM
- Unlimited CPU
- 10 GB storage
- Better performance for production

**Stop/Delete After Hackathon:**
```powershell
# Stop (preserve but don't charge)
az webapp stop --resource-group hallux-rg --name hallux-backend

# Delete everything
az group delete --name hallux-rg --yes
```

---

## 🚀 Quick Setup Summary

1. ✅ Go to portal.azure.com
2. ✅ Create Web App (Python 3.12, Linux)
3. ✅ Connect to GitHub repo
4. ✅ Add environment variables (API keys)
5. ✅ Set startup command (gunicorn with uvicorn)
6. ✅ Wait 5-10 minutes for deployment
7. ✅ Get URL: `https://hallux-backend.azurewebsites.net`
8. ✅ Update Vercel with backend URL
9. ✅ Test full stack!

**Total time:** ~15 minutes

---

## 🔐 Security Note

After hackathon:
1. Rotate OpenAI API key
2. Delete Azure resources if not needed
3. Remove old API keys from dashboards

---

## 📱 Final URLs

**Backend:** `https://hallux-backend.azurewebsites.net`
**Frontend:** `https://hallux-ayush.vercel.app` (your Vercel URL)
**API Docs:** `https://hallux-backend.azurewebsites.net/docs`

---

## ✅ Verification Checklist

- [ ] Azure App Service created
- [ ] GitHub connected for deployment
- [ ] Environment variables added (API keys)
- [ ] Startup command configured
- [ ] Backend deployed successfully
- [ ] Health check returns 200 OK
- [ ] Vercel updated with Azure backend URL
- [ ] Frontend redeployed
- [ ] Full stack test passed
- [ ] Demo ready! 🎉

Good luck with your hackathon! 🚀
