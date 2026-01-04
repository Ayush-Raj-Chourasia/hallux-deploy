import { Key, Cog, Send, ClipboardList, FileText, Search, ShieldCheck, FileOutput } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 relative max-w-3xl mx-auto">
          <div className="absolute inset-0.5 -translate-y-1/2 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 blur-3xl rounded-full w-1/2 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
            Documentation
          </h1>
          <p className="text-lg text-white/60">
            Learn how to integrate Hallux into your application to verify AI-generated content with confidence and transparency.
          </p>
          <p className="text-lg text-white/60 mt-4">
            Hallux provides a fast, reliable, and developer-friendly API for detecting hallucinations and validating citations in real time.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 group">
          {/* Getting Started */}
          <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Getting Started</h2>
            <p className="text-white/60 mb-4">
              Integrating Hallux takes only a few minutes. Follow the steps below to start verifying content instantly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 mt-1 text-indigo-400" />
                <p><strong>Create an API Key:</strong> Sign up on the Hallux dashboard and generate your secure API key.</p>
              </div>
              <div className="flex items-start gap-3">
                <Cog className="h-5 w-5 mt-1 text-indigo-400" />
                <p><strong>Set Up Your Client:</strong> Use our official SDK or any standard HTTP client (Axios, Fetch, cURL).</p>
              </div>
              <div className="flex items-start gap-3">
                <Send className="h-5 w-5 mt-1 text-indigo-400" />
                <p><strong>Send a Verification Request:</strong> Make a POST request to the <code>/api/verify</code> endpoint with your content.</p>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardList className="h-5 w-5 mt-1 text-indigo-400" />
                <p><strong>Handle the Response:</strong> Parse the structured JSON response to display citation status, confidence scores, and explanations.</p>
              </div>
            </div>
          </div>

          {/* Verification Workflow */}
          <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Verification Workflow</h2>
            <p className="text-white/60 mb-6">
              Hallux uses a robust, multi-layer verification pipeline designed for high accuracy and low latency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">1. Content Ingestion</h3>
                  <p className="text-sm text-white/60">
                    We accept raw text, URLs, PDFs, DOCX files, and images. For image-based content, OCR is applied automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <Search className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">2. Citation Detection</h3>
                  <p className="text-sm text-white/60">
                    Our NLP engine identifies, extracts, and normalizes all citations present in the content.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">3. 5-Layer Validation Engine</h3>
                  <p className="text-sm text-white/60">
                    Each citation is verified using: Source authenticity checks, URL and metadata validation, content consistency analysis, AI-based hallucination detection, and confidence scoring.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <FileOutput className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">4. Structured Output</h3>
                  <p className="text-sm text-white/60">
                    Results are returned in a clean, machine-readable JSON format, ready for direct UI integration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Overview */}
          <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">API Overview</h2>
            <p className="text-white/60 mb-4">
              Hallux exposes a simple REST API built for developers.
            </p>
            <p className="text-white mb-4">
              <strong>Primary Endpoint:</strong> <code>POST /api/verify</code>
            </p>
            <p className="text-white/60 mb-4">
              This endpoint accepts content and returns: Verification status, confidence scores, explanation per citation, and source metadata.
            </p>
            <p className="text-white">
              For detailed request and response schemas, refer to the <a href="/api" className="text-indigo-400 hover:text-indigo-300 underline">API Reference</a> section.
            </p>
          </div>
          
          {/* Why Developers Choose Hallux */}
          <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Why Developers Choose Hallux</h2>
            <ul className="space-y-2 text-white/60">
              <li>⚡ Sub-second verification speed</li>
              <li>🔍 Transparent citation explanations</li>
              <li>🔐 Privacy-first processing (no data stored)</li>
              <li>🧠 Built specifically to reduce AI hallucinations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
