export default function BlogPage() {
  const posts = [
    {
      title: "The Rise of AI Hallucinations: A Deep Dive",
      summary: "We explore the phenomenon of AI-generated misinformation and why verification tools are more important than ever.",
      date: "January 3, 2026",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "How We Built a 5-Layer Verification System",
      summary: "A technical look into the architecture of Hallux and the different layers of our citation analysis.",
      date: "December 28, 2025",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Integrating Hallux API into Your Workflow in 5 Minutes",
      summary: "A step-by-step guide for developers to quickly get started with our powerful verification API.",
      date: "December 20, 2025",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  ];

  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
            Our Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Insights, tutorials, and updates from the Hallux team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {posts.map((post, index) => (
            <div key={index} className={`p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.04]`}>
              <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                <a href="#" className="hover:text-indigo-400 transition-colors">{post.title}</a>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {post.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
