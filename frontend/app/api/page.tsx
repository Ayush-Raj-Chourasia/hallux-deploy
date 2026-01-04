export default function ApiPage() {
  const sampleRequest = `
{
  "text": "The transformer architecture (Vaswani et al., 2017) is foundational to modern AI. See https://arxiv.org/abs/1706.03762 for details.",
  "enable_ai_analysis": true
}
  `;

  const sampleResponse = `
{
  "request_id": "8f2e9b3a-4f1c-4b6d-8e7a-9c2d1b4f8e7a",
  "citations_found": 1,
  "verification_results": [
    {
      "citation_id": "bfa1b2c3-c4d5-e6f7-g8h9-i0j1k2l3m4n5",
      "status": "verified",
      "confidence_score": 0.98,
      "recommendation": "The citation appears to be valid and correctly formatted.",
      "validation_details": {
        "url_status": "ok",
        "metadata_match": true,
        "content_relevance": "high"
      }
    }
  ]
}
  `;

  return (
    <div className="bg-[#030303] min-h-screen font-mono">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300 font-sans">
            API Reference
          </h1>
          <p className="text-lg text-white/60 font-sans">
            Integrate Hallux's verification power directly into your applications.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-4 font-sans">POST /api/verify</h2>
          <p className="text-white/60 mb-8 font-sans">
            This is the primary endpoint for verifying citations within a block of text.
          </p>

          <h3 className="text-xl font-semibold text-white mb-4 font-sans">Request Body</h3>
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 mb-8">
            <pre className="text-sm text-white/80 whitespace-pre-wrap">
              <code>{sampleRequest}</code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold text-white mb-4 font-sans">Response Body</h3>
          <div className="p-4 rounded-xl bg-black/50 border border-white/10">
            <pre className="text-sm text-white/80 whitespace-pre-wrap">
              <code>{sampleResponse}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
