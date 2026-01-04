# 📚 What is Citation Verification? - Complete Guide

## 🤔 The Problem

When AI models (like ChatGPT, Gemini, etc.) write research papers or articles, they sometimes **"hallucinate"** - meaning they make up fake references that don't actually exist!

### Example of AI Hallucination:
```
❌ BAD: "According to Smith et al. (2023), quantum computing is 
         revolutionary [doi:10.1234/fake.citation]"
```

**Problem:** This citation looks real, but:
- The DOI link doesn't work
- Smith et al. (2023) doesn't exist
- The paper was never published

## ✅ What Hallux Does

Hallux **automatically detects** these fake citations by checking if they're real!

### What is a "Citation"?

A citation is a reference to another work. Common formats:

1. **Author-Year Format:**
   ```
   "According to Smith et al. (2023), AI is important."
   ```

2. **DOI (Digital Object Identifier):**
   ```
   "Recent research [doi:10.1038/nature12345] shows..."
   ```

3. **arXiv Preprint:**
   ```
   "The paper [arXiv:2301.12345] demonstrates..."
   ```

4. **URL Links:**
   ```
   "As stated in https://arxiv.org/abs/2301.12345..."
   ```

5. **Numbered References:**
   ```
   "Previous work [1] has shown..."
   ```

## 🔍 How Hallux Finds Citations

### Step 1: Text Extraction
When you upload a document (PDF, Word, etc.), Hallux:
1. Extracts all the text
2. Scans for citation patterns using regex
3. Identifies sentences containing references

### Step 2: Pattern Matching
Hallux looks for these patterns:

```python
✓ DOI: "10.1234/example.citation"
✓ arXiv: "arXiv:2301.12345"
✓ URLs: "https://doi.org/10.1234/..."
✓ Author-Year: "Smith et al. (2023)"
✓ Numbered: "[1]", "[2]"
```

### Example Text Analysis:

**Input Text:**
```
Recent advances in AI (Brown et al., 2020) have shown 
significant progress. The GPT-3 model [doi:10.48550/arXiv.2005.14165] 
demonstrated impressive capabilities. However, according to 
Johnson (2025), some concerns remain.
```

**Citations Found:**
```
1. "Brown et al., 2020" ✓ (Real paper)
2. "doi:10.48550/arXiv.2005.14165" ✓ (Real GPT-3 paper)
3. "Johnson (2025)" ❌ (Suspicious - year 2025 is in the future!)
```

## 🛡️ 5-Layer Verification System

Once citations are found, Hallux verifies them through **5 layers**:

### Layer 1: 🔗 URL Validation (WORKING)
**Purpose:** Check if URLs are accessible

**How it works:**
1. Extracts URLs from citation
2. Sends HTTP request to check if URL exists
3. Validates response (200 OK = good, 404 = broken)

**Example:**
```
Citation: "See https://arxiv.org/abs/2005.14165"
✓ URL accessible - PASSED
❌ URL returns 404 - FAILED
```

### Layer 2: 📋 Metadata Check (Framework Ready)
**Purpose:** Verify publication details via Crossref API

**How it works:**
1. Extract DOI from citation
2. Query Crossref database for metadata
3. Check: Title, Authors, Journal, Year

**Example:**
```
DOI: 10.1038/nature12345
Query Crossref API →
Response: {
  "title": "AI in Healthcare",
  "authors": ["Smith, J.", "Doe, A."],
  "journal": "Nature",
  "year": 2023
}
✓ Metadata found - VERIFIED
```

### Layer 3: 📄 Content Verification (Framework Ready)
**Purpose:** Check if cited content matches claim

**How it works:**
1. Scrape the actual paper (using Playwright)
2. Extract abstract/content
3. Compare claim vs actual content

**Example:**
```
Claim: "Smith et al. (2023) proved AI is safe"
Actual paper abstract: "...AI safety remains an open challenge..."
❌ Content mismatch - SUSPICIOUS
```

### Layer 4: 🤖 AI Confidence Scoring (WORKING with GPT-4)
**Purpose:** Use AI to analyze citation authenticity

**How it works:**
1. Send citation to GPT-4/Gemini
2. AI analyzes: structure, plausibility, patterns
3. Returns confidence score (0-100%)

**Example:**
```
Citation: "According to Smith et al. (2099), time travel is real"

GPT-4 Analysis:
- Year 2099 is impossible (future date) ❌
- "time travel" is not credible claim ❌
- Confidence: 15% (FAKE)
```

### Layer 5: 🕸️ Citation Graph (Framework Ready)
**Purpose:** Analyze citation network via OpenAlex

**How it works:**
1. Build graph of who cites this paper
2. Check if paper is cited by reputable sources
3. Analyze citation patterns

**Example:**
```
Paper: "Smith et al. 2023"
Cited by: Nature (5x), Science (3x), IEEE (12x)
✓ Well-cited by reputable journals - VERIFIED
```

## 📊 How Results Are Displayed

### Summary Statistics:
```
Total Citations: 50
✓ Verified: 45 (90%)
⚠️ Suspicious: 3 (6%)
❌ Fake: 2 (4%)
Overall Confidence: 87%
```

### Individual Citation Results:

**Example 1: VERIFIED ✅**
```
Citation: "Brown et al. (2020) Language Models are Few-Shot Learners"
Status: VERIFIED
Confidence: 95%
Layers:
  ✓ URL Validation: PASSED (https://arxiv.org/abs/2005.14165)
  ✓ AI Scoring: High confidence (GPT-4: 95%)
```

**Example 2: SUSPICIOUS ⚠️**
```
Citation: "Johnson (2025) proves quantum supremacy"
Status: SUSPICIOUS
Confidence: 45%
Flags:
  - Year 2025 is in the future (impossible)
  - Missing DOI/URL
  - Overconfident claim ("proves")
```

**Example 3: FAKE ❌**
```
Citation: "See doi:10.9999/fake.12345"
Status: FAKE
Confidence: 5%
Layers:
  ✗ URL Validation: FAILED (404 Not Found)
  ✗ AI Scoring: Very low confidence
```

## 🎯 Live Demo Examples

### Test 1: Upload a PDF with Real Citations

**Input:** Research paper PDF
```
Upload → Extract text → Find 20 citations → Verify each
```

**Output:**
```
✅ 18 citations verified (DOIs work, metadata matches)
⚠️ 1 suspicious (broken URL but exists in Crossref)
❌ 1 fake (DOI doesn't exist)
```

### Test 2: Paste Text with Mixed Citations

**Input Text:**
```
According to Smith et al. (2023), AI is advancing rapidly [1]. 
The GPT-4 paper [doi:10.48550/arXiv.2303.08774] demonstrates 
this. However, Johnson (2099) claims time travel is possible.
```

**Analysis:**
```
Citation 1: "Smith et al. (2023)" 
→ ⚠️ SUSPICIOUS (no DOI/URL to verify)

Citation 2: "doi:10.48550/arXiv.2303.08774"
→ ✅ VERIFIED (real GPT-4 technical report)

Citation 3: "Johnson (2099)"
→ ❌ FAKE (impossible year, no source)
```

### Test 3: Detect Hallucinated Citations

**Input:**
```
"This paper from 2099 proves everything (doi:10.fake/12345)"
```

**Detection:**
```
Pattern Analysis:
✗ Year 2099 - Future date (impossible)
✗ doi:10.fake/12345 - Invalid DOI format
✗ "proves everything" - Overconfident language

Result: HALLUCINATION DETECTED
Confidence: 2%
Recommendation: This citation is fabricated
```

## 🛠️ How to Use the System

### Method 1: Text Input (No File Upload)

1. Go to http://localhost:3000
2. Scroll to **"Try It Now"** section
3. **Paste your text** with citations
4. Click **"Verify Citations"**
5. See instant results!

**What it does:**
- Extracts citations from your text
- Verifies each one
- Shows confidence scores

### Method 2: Document Upload (PDF/Word)

1. Go to http://localhost:3000
2. Scroll to **"Upload Document"** section
3. **Drag & drop** a PDF or Word file
4. System automatically:
   - Extracts text (with OCR if needed)
   - Finds all citations
   - Verifies each one
   - Shows results with metadata

**Example workflow:**
```
Upload research_paper.pdf
→ Extracted 5,234 characters
→ Found 50 citations
→ Verifying...
→ Results: 45 verified, 3 suspicious, 2 fake
```

## 🎨 What You See on the Website

### Landing Page Sections:

1. **Hero Section**
   - "Detect AI Hallucinations Instantly"
   - Animated background with gradient
   - "Try Demo" button

2. **Features Section**
   - 5-Layer Verification
   - AI-Powered Detection
   - Document Upload
   - Confidence Scoring

3. **Document Upload** ⭐ NEW
   - Drag & drop interface
   - File type icons
   - Progress indicator
   - Results display:
     ```
     ✅ 45 Verified
     ⚠️ 3 Suspicious
     ❌ 2 Failed
     ```

4. **Try It Now Demo**
   - Text input box
   - "Verify Citations" button
   - Live results with color coding:
     - 🟢 Green = Verified
     - 🟡 Yellow = Suspicious
     - 🔴 Red = Fake

5. **Results Visualization**
   - Individual citation cards
   - Confidence meters
   - Layer-by-layer breakdown
   - Suggestions for fixing issues

## 🧪 What "Citation Verification" Actually Means

### In Simple Terms:

**Before Hallux:**
```
You: "Is this citation real?"
Problem: No easy way to check! You'd have to:
- Manually search Google Scholar
- Check if DOI works
- Read the actual paper
- Compare claims
⏰ Takes 5-10 minutes PER citation
```

**With Hallux:**
```
You: Upload document
Hallux: Automatically finds 50 citations
Hallux: Verifies all 50 in 10 seconds
You: See instant results!
⏰ Takes 10 seconds for ALL citations
```

### What We Check:

1. **Does the citation exist?**
   - Is the DOI real?
   - Is the URL accessible?
   - Does the paper appear in databases?

2. **Is the metadata correct?**
   - Right authors?
   - Right year?
   - Right journal?

3. **Does the content match the claim?**
   - If you say "Paper X proves Y"
   - Does Paper X actually say Y?

4. **Is it plausible?**
   - GPT-4 checks: "Does this look real?"
   - Impossible years (2099)?
   - Fake DOI formats?
   - Suspicious patterns?

## 🚀 Why This is Innovative

### Traditional Approach:
```
❌ Manual checking (slow)
❌ No AI integration
❌ No pattern detection
❌ One citation at a time
```

### Hallux Approach:
```
✅ Automated extraction
✅ 5-layer verification
✅ AI-powered analysis (GPT-4 + Gemini)
✅ Batch processing (50 citations in seconds)
✅ Research-based detection (4 models integrated)
✅ Beautiful UI with drag & drop
```

## 📝 Summary

**What is Citation Verification?**
Checking if references in a document are real or fabricated (hallucinated).

**How does Hallux do it?**
1. Extracts text from documents
2. Finds all citations (DOIs, URLs, Author-Year)
3. Verifies through 5 layers
4. Uses AI (GPT-4) to detect patterns
5. Shows results with confidence scores

**Why does this matter?**
- AI models frequently hallucinate fake citations
- Manual checking is slow and error-prone
- Hallux automates the entire process
- Helps maintain academic integrity

**What you see:**
- Upload PDF → See 50 citations verified instantly
- Paste text → Get confidence scores for each reference
- Drag & drop → Visual results with color coding

**Bottom Line:**
Hallux acts like a fact-checker for citations, automatically detecting when an AI (or human!) has made up fake references. It's like having a research librarian verify every citation in seconds! 🚀
