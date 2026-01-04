# 🚀 Complete Deployment Guide for Vercel + Backend

## ❌ Current Error Fix

**Error:** `npm error enoent Could not read package.json`

**Cause:** Vercel is looking in the root directory, but `package.json` is in `frontend/` folder

**Solution:** Update your Vercel configuration

---

## ✅ CORRECT Vercel Configuration

### On Vercel Dashboard:

```
Framework Preset:     Next.js
Root Directory:       frontend    ← CRITICAL! NOT ./frontend, just "frontend"
Build Command:        npm run build
Output Directory:     .next
Install Command:      npm install

Environment Variables:
Key:   NEXT_PUBLIC_API_URL
Value: http://localhost:8000  (update after backend deploys)
```

### Alternative: Let Vercel Auto-detect

Since I've added `vercel.json` in the root, you can also:

1. **Delete the current deployment** in Vercel
2. **Re-import** from GitHub
3. Vercel will read `vercel.json` automatically
4. Just add the environment variable

---

## 🎯 Step-by-Step Fix

### Option 1: Update Current Deployment (Fastest)

1. Go to your Vercel project
2. Click **Settings**
3. Scroll to **Build & Development Settings**
4. Change:
   - **Root Directory:** `frontend` (remove the `./`)
   - **Framework Preset:** Next.js (optional but helps)
5. Go to **Deployments** tab
6. Click **Redeploy** on the latest deployment
7. Click **Redeploy** again to confirm

### Option 2: Fresh Deployment (Recommended)

1. **Delete current project** in Vercel dashboard
2. Go back to **New Project**
3. Import `Ayush-Raj-Chourasia/Hallux`
4. Configure:
   ```
   Framework Preset:  Next.js
   Root Directory:    frontend
   ```
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = http://localhost:8000
   ```
6. Click **Deploy**

---

## 🔥 Backend Deployment (Do This First!)

Your frontend needs a backend URL. Deploy backend to Render.com:

### Step 1: Create `render.yaml` in root

Already done! File is in the repo.

### Step 2: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect repo: `Ayush-Raj-Chourasia/Hallux`
5. Configure:
   ```
   Name:          hallux-backend
   Region:        US East (Ohio)
   Branch:        main
   Root Directory: backend
   Runtime:       Python 3.12
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

### Step 3: Add Environment Variables in Render

Click **Environment** and add:

```bash
OPENAI_API_KEY=your-openai-key-here

GOOGLE_API_KEY=your-gemini-key-here

CROSSREF_EMAIL=team@hallux.dev

ENVIRONMENT=production

DEBUG=False
```

### Step 4: Deploy!

Click **Create Web Service**

Wait 5-10 minutes for build. You'll get URL like:
```
https://hallux-backend.onrender.com
```

---

## 🔗 Connect Frontend to Backend

Once backend is deployed:

### Step 1: Update Vercel Environment Variable

1. Go to Vercel project
2. **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_API_URL`
4. Edit value to: `https://hallux-backend.onrender.com`
5. Save

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab
2. Click latest deployment
3. Click **⋯** (three dots) → **Redeploy**
4. Select **Use existing Build Cache** (unchecked)
5. Click **Redeploy**

---

## 📋 Quick Checklist

### Backend (Render.com):
- [ ] Render account created
- [ ] Web Service created from GitHub
- [ ] Root directory: `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables added (API keys)
- [ ] Deployment successful
- [ ] Backend URL obtained (e.g., `https://hallux-backend.onrender.com`)

### Frontend (Vercel):
- [ ] Vercel project created
- [ ] Root directory: `frontend` (NOT `./frontend`)
- [ ] Framework: Next.js
- [ ] Environment variable `NEXT_PUBLIC_API_URL` added
- [ ] First deployment (may fail if backend not ready)
- [ ] Updated API URL after backend deployed
- [ ] Redeployed with correct backend URL
- [ ] Site is live! 🎉

---

## 🧪 Test Your Deployment

### Test Frontend:
```
https://hallux-your-username.vercel.app
```
- Should show landing page
- Animations should work
- "Try It Now" section visible

### Test Backend:
```
https://hallux-backend.onrender.com/api/health
```
- Should return: `{"status": "healthy"}`

### Test Full Stack:
1. Go to your Vercel URL
2. Scroll to "Try It Now"
3. Click "Load Example"
4. Click "Verify Now"
5. Should see verification results!

---

## ⚡ Troubleshooting

### Issue: Vercel still shows package.json error

**Fix:**
1. Check Root Directory is `frontend` (not `./frontend` or `/frontend`)
2. Try deleting and re-importing the project
3. Make sure `vercel.json` is in the repo root

### Issue: Frontend deploys but shows connection error

**Fix:**
1. Backend not deployed yet - deploy to Render first
2. Wrong API URL - check environment variable
3. CORS issue - backend should allow your Vercel domain

### Issue: Backend fails to deploy on Render

**Fix:**
1. Check build logs
2. Make sure `requirements.txt` is in `backend/` folder
3. Verify Python version (should be 3.12)

### Issue: API keys not working

**Fix:**
1. Re-enter API keys in Render (no extra spaces)
2. Make sure they're in Environment tab, not Secret Files
3. Redeploy after adding/updating keys

---

## 🎬 Expected Timeline

```
00:00 - Start deployment
00:05 - Backend build started on Render
00:10 - Backend deployed, URL obtained
00:12 - Frontend deployed on Vercel (first time)
00:15 - Updated frontend with backend URL
00:17 - Redeployed frontend
00:20 - Full system live! ✅
```

---

## 📱 Share Your Project

After deployment, you'll have:

**Frontend URL:**
```
https://hallux-ayush.vercel.app
```

**Backend URL:**
```
https://hallux-backend.onrender.com
```

**API Docs:**
```
https://hallux-backend.onrender.com/docs
```

---

## 🔐 Security Notes

**⚠️ Warning:** Your API keys are exposed in this chat!

After deployment:
1. Rotate your OpenAI API key in OpenAI dashboard
2. Generate new Gemini API key
3. Update keys in Render environment variables
4. Delete old keys from OpenAI/Google dashboards

---

## 🚀 Quick Commands

### Push changes to trigger redeploy:
```bash
git add .
git commit -m "Update deployment config"
git push origin main
```

Both Vercel and Render auto-deploy on push!

---

## 📊 Cost Estimate

- **Vercel Frontend:** Free (Hobby plan)
- **Render Backend:** Free (750 hours/month, spins down after 15 min inactivity)
- **Total:** $0/month ✨

**Note:** Free tier backend sleeps after inactivity. First request after sleep takes ~30-60 seconds to wake up.

---

## 🎉 You're All Set!

Follow the steps above and you'll have a live demo in 20 minutes! Good luck with the hackathon! 🚀
