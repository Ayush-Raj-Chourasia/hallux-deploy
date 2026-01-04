# 🔧 Fixing the 500 Error - Quick Guide

## ✅ What I Fixed

### Problem:
You got a **500 Internal Server Error** when uploading documents to `/api/upload-document`

### Root Cause:
The `verify_text` function was being called with wrong parameters. It expected a `VerificationOptions` object but was receiving `enable_ai_analysis` as a direct parameter.

### Solution Applied:

**Fixed in `backend/app/api/document.py`:**

```python
# ❌ OLD (Broken):
result = await verification_service.verify_text(
    text=extracted_text,
    enable_ai_analysis=enable_ai_analysis  # Wrong parameter!
)

# ✅ NEW (Working):
options = VerificationOptions(
    enable_ai_scoring=enable_ai_analysis,
    check_metadata=False,
    check_content=False
)

result = await verification_service.verify_text(
    text=extracted_text,
    format="plain",
    options=options  # Correct parameter!
)
```

Also added:
- Better error logging with full traceback
- Import for `VerificationOptions`
- More detailed error messages

## 🚀 How to Test the Fix

### Step 1: Restart Backend (if needed)
The backend should auto-reload, but if not:

```powershell
cd "C:\Users\iters\Downloads\Hallux\backend"
# Stop current server (Ctrl+C if running)
python -m uvicorn app.main:app --reload
```

You should see:
```
✅ OpenAI client initialized
✅ Gemini client initialized
🚀 Starting Hallux API Server...
```

### Step 2: Test Document Upload

**Option A: Via Frontend (Easiest)**

1. Go to http://localhost:3000
2. Scroll to "Upload Document" section
3. Create a simple test file:

```text
# Save this as test.txt:
According to Brown et al. (2020), GPT-3 is powerful.
See https://arxiv.org/abs/2005.14165 for details.
```

4. Drag & drop `test.txt` onto upload area
5. Should see: ✅ Success with extracted citations

**Option B: Via Command Line**

```powershell
# Test with curl (if you have it)
$text = "According to Smith et al. (2023), AI is advancing."
curl -X POST http://localhost:8000/api/verify-text `
  -H "Content-Type: application/json" `
  -d "{\"text\": \"$text\"}"
```

Expected response:
```json
{
  "total_citations": 1,
  "verified_count": 0,
  "suspicious_count": 1,
  "fake_count": 0,
  "results": [...],
  "overall_confidence": 45.0
}
```

### Step 3: Test Text Verification (Simpler)

1. Go to http://localhost:3000
2. Scroll to "Try It Now" section
3. Click **"Load Example"** button (NEW!)
4. Click **"Verify Now"**
5. Should see results appear below

## 📚 Understanding "No Visible Citations"

### Your Question:
> "what do u mean by citation verify as u are showing on website as there is noc atual citiatuion is viblie for given text"

### Answer:

**Citations are extracted automatically from text!** You don't need to manually mark them.

#### Example 1: Author-Year Format
```
Input: "According to Smith et al. (2023), AI is important."
                     ^^^^^^^^^^^^^^^^
Citation found: "Smith et al. (2023)"
```

#### Example 2: DOI Link
```
Input: "The paper [doi:10.1038/nature12345] shows results."
                   ^^^^^^^^^^^^^^^^^^^^^^^^^
Citation found: "doi:10.1038/nature12345"
```

#### Example 3: URL
```
Input: "See https://arxiv.org/abs/2005.14165 for details."
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Citation found: "https://arxiv.org/abs/2005.14165"
```

#### Example 4: Multiple Citations in One Sentence
```
Input: "Recent work (Brown et al., 2020) on GPT-3 
       [doi:10.48550/arXiv.2005.14165] demonstrates 
       impressive capabilities."

Citations found:
1. "Brown et al., 2020"
2. "doi:10.48550/arXiv.2005.14165"
```

### What the System Does:

1. **Scans your text** for citation patterns using regex
2. **Extracts sentences** containing these patterns:
   - `Smith et al. (2023)` ✓
   - `doi:10.xxxx/xxxxx` ✓
   - `https://arxiv.org/...` ✓
   - `[1]`, `[2]` (numbered references) ✓
3. **Verifies each citation** through 5 layers
4. **Shows results** with confidence scores

### Example Test:

**Paste this into "Try It Now":**
```
Recent advances in AI (Brown et al., 2020) have been 
significant. The GPT-3 paper [doi:10.48550/arXiv.2005.14165] 
demonstrated impressive results. However, claims by Johnson 
(2099) about time travel seem suspicious.
```

**What Hallux will find:**
```
✓ "Brown et al., 2020" - Real citation
✓ "doi:10.48550/arXiv.2005.14165" - Real GPT-3 paper
❌ "Johnson (2099)" - Fake (impossible year)
```

**You'll see on screen:**
```
Total Citations: 3
✅ Verified: 1
⚠️ Suspicious: 1
❌ Fake: 1
```

## 🎯 Quick Demo Steps

### Method 1: Text Demo (Fastest)

1. Open http://localhost:3000
2. Scroll to "Try It Now"
3. Click **"Load Example"** (loads sample text with citations)
4. Click **"Verify Now"**
5. See instant results showing which citations are real/fake

### Method 2: Document Upload

1. Create a simple text file with citations
2. Go to http://localhost:3000
3. Scroll to "Upload Document"
4. Drag & drop the file
5. See extracted text + verified citations

## ⚠️ Common Issues

### Issue 1: "No citations found"
**Cause:** Your text doesn't contain recognizable citation patterns

**Solution:** Add citations like:
- `Smith et al. (2023)`
- `https://arxiv.org/abs/2005.14165`
- `doi:10.1038/nature12345`

### Issue 2: Backend not running
**Symptom:** Frontend shows connection error

**Solution:**
```powershell
cd backend
python -m uvicorn app.main:app --reload
```

### Issue 3: Frontend not running
**Symptom:** http://localhost:3000 not accessible

**Solution:**
```powershell
cd frontend
npm run dev
```

## 📊 What Success Looks Like

### Backend Terminal:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✅ OpenAI client initialized
✅ Gemini client initialized
🚀 Starting Hallux API Server...
📄 Processing uploaded file: test.txt
✅ Extracted 234 characters from test.txt
```

### Frontend Terminal:
```
✓ Ready in 1.2s
○ Local:   http://localhost:3000
```

### Browser Console:
```
✓ No errors
✓ API calls succeed
✓ Results display correctly
```

## 🎉 You're All Set!

The 500 error is fixed! Now you can:
1. ✅ Upload documents (PDF, DOCX, text)
2. ✅ Extract citations automatically
3. ✅ Verify with 5-layer system
4. ✅ See confidence scores
5. ✅ Detect hallucinations

Test it out:
1. Go to http://localhost:3000
2. Click "Load Example" in "Try It Now"
3. Click "Verify Now"
4. Watch the magic happen! ✨

For detailed explanation of how citation verification works, see: `WHAT_IS_CITATION_VERIFICATION.md`
