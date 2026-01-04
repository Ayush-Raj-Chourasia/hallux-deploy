import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
            Live Demo
          </h1>
          <p className="text-lg text-white/60">
            This page explains how our AI citation verification works. The full, interactive demo is available on our homepage.
          </p>
        </div>

        <div className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">How the Demo Works</h3>
            <p className="text-white/60 mb-8">
              Hallux analyzes your text to identify and validate citations using a multi-layer process, including source validation, hallucination detection, and confidence scoring.
            </p>
            <div className="w-full h-64 bg-black/30 rounded-lg flex items-center justify-center border border-dashed border-white/10">
              <div className="text-center">
                <p className="text-white/80 font-semibold">Conceptual Demo Flow</p>
                <p className="text-white/60 text-sm mt-2">1. Citation Extraction → 2. Source Validation → 3. AI Analysis → 4. Confidence Score</p>
              </div>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium hover:from-indigo-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 mt-8">
              <PlayCircle className="h-5 w-5" />
              Try the Interactive Demo on the Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
