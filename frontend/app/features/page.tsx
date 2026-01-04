import { Shield, Zap, Brain, Search, CheckCircle2, Bot } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: "Real-time Verification",
      description: "Get instant results in under 3 seconds. No waiting, no delays.",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Search,
      title: "5-Layer Analysis",
      description: "URL validation, metadata check, content verification, AI scoring, and citation graph.",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get detailed explanations and confidence scores for every citation.",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: CheckCircle2,
      title: "Multi-Format Support",
      description: "Works with text, PDFs, DOIs, arXiv IDs, and URLs seamlessly.",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Shield,
      title: "Trustworthy & Secure",
      description: "Your data is processed securely and is never stored on our servers.",
      gradient: "from-red-500/20 to-rose-500/20",
    },
    {
      icon: Bot,
      title: "API for Developers",
      description: "Integrate our verification engine into your own applications with a simple API.",
      gradient: "from-gray-500/20 to-gray-400/20",
    },
  ];

  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0.5 -translate-y-1/2 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 blur-3xl rounded-full w-1/2 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
            Product Features
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover the powerful features that make Hallux the best AI citation verification tool.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.06] hover:scale-[1.02] hover:border-white/20">
              <div className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${feature.gradient} border border-white/[0.1]`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
