export default function LicensePage() {
  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
            MIT License
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: January 3, 2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">License</h2>
          <p className="text-muted-foreground leading-relaxed">
            This is a placeholder for the MIT License.
          </p>
        </div>
      </div>
    </div>
  );
}
