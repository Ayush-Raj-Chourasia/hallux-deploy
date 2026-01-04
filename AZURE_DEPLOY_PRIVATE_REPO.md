# 🚀 Azure Deployment with Private GitHub Repo

## Problem: Azure can't access your private forked repo
Your repo: https://github.com/Ayush-Raj-Chourasia/Hallux (private)

## ✅ Solution Options:

### Option 1: Make Your Fork Public (Easiest - 30 seconds)
1. Go to: https://github.com/Ayush-Raj-Chourasia/Hallux/settings
2. Scroll down to "Danger Zone"
3. Click "Change visibility" → "Make public"
4. Type repository name to confirm
5. Done! Now Azure can access it

### Option 2: Use Azure Deployment Credentials (Keep Private)

#### Step A: Get Azure Deployment Credentials
In your Azure Portal screenshot, click "Deployment Center" → "FTPS Credentials"
Copy the username and password

#### Step B: Set up Git deployment from your local machine

```powershell
# Navigate to backend folder
cd C:\Users\iters\Downloads\Hallux\backend

# Initialize git if not already
git init

# Add Azure remote (replace with your username from FTPS Credentials)
$username = "Hallux\your-deployment-username"
$appName = "Hallux"
git remote add azure https://$username@hallux-fefsdqc6fmbmdkcu.scm.eastasia-01.azurewebsites.net/$appName.git

# Deploy
git add .
git commit -m "Deploy backend to Azure"
git push azure main

# It will ask for password - use the password from FTPS Credentials
```

### Option 3: ZIP Deploy (No Git Required - Fastest!)

```powershell
# From project root
cd C:\Users\iters\Downloads\Hallux\backend

# Create deployment ZIP
Compress-Archive -Path app,requirements.txt -DestinationPath deploy.zip -Force

# Upload via Kudu (Azure's deployment engine)
# 1. Go to: https://hallux-fefsdqc6fmbmdkcu.scm.eastasia-01.azurewebsites.net
# 2. Click "Tools" → "ZIP Push Deploy"  
# 3. Drag deploy.zip to the wwwroot folder
# 4. Wait for deployment to complete

Write-Host "✅ deploy.zip created! Upload it via Azure Portal" -ForegroundColor Green
```

---

## 📋 After Deployment: Set Environment Variables

In Azure Portal → Hallux → Settings → Environment variables, add:

```
OPENAI_API_KEY=sk-your-key-here
GOOGLE_API_KEY=your-gemini-key
ENV=production
LOG_LEVEL=INFO
ALLOWED_ORIGINS=*
```

Then restart the app: Hallux → Overview → Restart

---

## 🧪 Test Deployment

```powershell
# Test health endpoint
curl https://hallux-fefsdqc6fmbmdkcu.eastasia-01.azurewebsites.net/api/health

# Should return: {"status":"healthy","timestamp":"..."}
```

---

## 🎯 Quick Start (Choose One):

**Easiest:** Make repo public → Azure Deployment Center → GitHub → Auto-deploy

**Fastest:** Run the ZIP deploy commands above

**Most Secure:** Use Git with FTPS credentials (keeps repo private)
