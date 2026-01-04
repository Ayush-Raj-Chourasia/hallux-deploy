"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-12 px-4 bg-[#030303] border-t border-white/10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 mb-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300 mb-3">
              HALLUX
            </h3>
            <p className="text-white/60 text-sm mb-4 max-w-sm">
              Making AI trustworthy, one citation at a time. Built for ByteQuest Hackathon 2026.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ByteQuest-2025/GFGBQ-Team-idiotics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/features" className="text-white/50 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-white/50 hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-white/50 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-white/50 hover:text-white transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/about" className="text-white/50 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ByteQuest-2025/GFGBQ-Team-idiotics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-white/50 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/60">
            © 2026 Hallux. Built for ByteQuest Hackathon
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/license" className="text-white/50 hover:text-white transition-colors">
              MIT License
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
