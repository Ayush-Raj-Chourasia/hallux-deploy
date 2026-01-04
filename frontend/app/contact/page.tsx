export default function ContactPage() {
  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
            Contact Us
          </h1>
          <p className="text-lg text-white/60">
            Have a question or want to work with us? Drop us a line.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">Name</label>
                <input type="text" id="name" className="w-full bg-white/[0.03] text-white placeholder:text-white/60 rounded-lg p-3 border border-white/10 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">Email</label>
                <input type="email" id="email" className="w-full bg-white/[0.03] text-white placeholder:text-white/60 rounded-lg p-3 border border-white/10 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">Message</label>
                <textarea id="message" rows={4} className="w-full bg-white/[0.03] text-white placeholder:text-white/60 rounded-lg p-3 border border-white/10 focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full px-6 py-3 rounded-lg font-medium transition-all text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:shadow-lg hover:shadow-indigo-500/25">
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-4 text-white/60">
              <p>
                <strong>Email:</strong> team@hallux.dev
              </p>
              <p>
                <strong>Address:</strong> RCOEM, Nagpur, India
              </p>
              <p>
                Built for the ByteQuest Hackathon 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
