"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { verifyText, type VerifyTextResponse } from "@/lib/api";

export function CTASection() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyTextResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleText = `Recent advances in large language models have been remarkable. According to Brown et al. (2020), GPT-3 demonstrated few-shot learning capabilities that revolutionized NLP. The paper is available at https://arxiv.org/abs/2005.14165 and has been widely cited.

However, some claims require careful verification. For instance, Johnson et al. (2099) suggested that time travel is possible, which seems suspicious given the impossible publication date. Another questionable source [doi:10.9999/fake.citation] lacks proper validation.

The transformer architecture (Vaswani et al., 2017) remains foundational to modern AI systems. This architecture has enabled breakthroughs in computer vision, natural language processing, and beyond.`;

  const loadExample = () => {
    setInputText(sampleText);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyText({
        text: inputText,
        enable_ai_analysis: true,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify text. Make sure the backend is running at http://localhost:8000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="demo" className="relative py-24 px-4 bg-[#030303] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.1] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/[0.1] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-white/80">Try It Now</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
              Verify Citations Instantly
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Paste any text with citations and see Hallux in action
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text with citations here...&#10;&#10;Example: According to Smith et al. (2023), AI models can generate fake citations. See more at https://arxiv.org/abs/2301.12345"
                className={cn(
                  "w-full h-48 bg-transparent text-white placeholder:text-white/40",
                  "resize-none outline-none font-mono text-sm",
                  "leading-relaxed"
                )}
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-white/40">
                    {inputText.length > 0 ? `${inputText.length} characters` : "Start typing..."}
                  </div>
                  <button
                    type="button"
                    onClick={loadExample}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Load Example
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || inputText.length === 0}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                    "bg-gradient-to-r from-indigo-500 to-rose-500",
                    "text-white font-medium",
                    "hover:from-indigo-600 hover:to-rose-600",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "shadow-lg shadow-indigo-500/25"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Verify Now
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Decorative gradient border effect */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-rose-500/20 blur-xl" />
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              🔒 Your data is processed securely • No storage • Real-time results
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-500">
              98%
            </div>
            <div className="text-white/60 text-sm mt-2">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-rose-500">
              &lt;3s
            </div>
            <div className="text-white/60 text-sm mt-2">Avg Speed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500">
              5
            </div>
            <div className="text-white/60 text-sm mt-2">Layers</div>
          </div>
        </motion.div>

        {/* Results Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <h4 className="text-red-300 font-semibold mb-1">Error</h4>
                <p className="text-red-200/80 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/[0.08]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Verification Results</h3>
              <div className="text-sm text-white/60">
                Found {result.total_citations} citation{result.total_citations !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <div>
                  <div className="text-green-300 font-semibold">{result.verified_count}</div>
                  <div className="text-white/60 text-xs">Verified</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <div>
                  <div className="text-yellow-300 font-semibold">{result.suspicious_count}</div>
                  <div className="text-white/60 text-xs">Suspicious</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
                <XCircle className="h-4 w-4 text-red-400" />
                <div>
                  <div className="text-red-300 font-semibold">{result.fake_count}</div>
                  <div className="text-white/60 text-xs">Failed</div>
                </div>
              </div>
            </div>

            {/* Individual Results */}
            <div className="space-y-4">
              {result.results.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.status === "verified" && (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      )}
                      {item.status === "suspicious" && (
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      )}
                      {(item.status === "fake" || item.status === "url_broken") && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className="text-white font-medium">Citation {idx + 1}</span>
                    </div>
                    <div className="text-sm text-white/60">
                      Confidence: {Math.round(item.confidence)}%
                    </div>
                  </div>
                  <div className="text-white/80 text-sm mb-3">{item.citation}</div>
                  <div className="text-white/60 text-xs line-clamp-2">{item.ai_reasoning}</div>
                </div>
              ))}
            </div>
          </motion.div>

        )}
      </div>
    </section>
  );
}
