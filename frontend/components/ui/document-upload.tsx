"use client";

import { useState, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Upload, File, FileText, Image, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadResult {
  filename: string;
  citations_found: number;
  verification_results: any[];
  summary?: {
    verified: number;
    suspicious: number;
    failed: number;
  };
  metadata?: {
    extraction_method: string;
    pages?: number;
    text_length: number;
  };
}

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("enable_ocr", "true");
      formData.append("enable_ai_analysis", "true");

      const response = await fetch("http://localhost:8000/api/upload-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-8 w-8" />;
    if (['jpg', 'jpeg', 'png', 'tiff', 'bmp'].includes(ext || '')) return <Image className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <section className="relative py-24 px-4 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.08] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/[0.08] rounded-full blur-[90px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <Upload className="h-4 w-4 text-indigo-400" />
            <span className="text-white/80 text-sm font-medium">Document Upload</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300">
              Upload & Verify
            </span>
          </h2>
          
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Upload PDF, DOCX, or images. We'll extract text with OCR and verify all citations automatically.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: "preserve-3d",
            transform,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300",
              dragActive
                ? "border-indigo-400/50 bg-indigo-500/5"
                : "border-white/[0.08] bg-white/[0.02]"
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-4 rounded-lg bg-white/[0.02]"
              style={{
                transform: "translateZ(20px)",
              }}
            />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png,.tiff,.bmp"
              onChange={handleChange}
            />

            {!file ? (
              <motion.div
                style={{
                  transform: "translateZ(40px)",
                }}
              >
                <label htmlFor="file-upload" className="cursor-pointer block text-center">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-white/40" />
                  <p className="text-white/80 text-lg mb-2">
                    Drag & drop your document here
                  </p>
                  <p className="text-white/40 text-sm mb-4">
                    or click to browse
                  </p>
                  <p className="text-white/30 text-xs">
                    Supports: PDF, DOCX, Images (JPG, PNG, TIFF)
                  </p>
                </label>
              </motion.div>
            ) : (
              <motion.div
                className="text-center"
                style={{
                  transform: "translateZ(40px)",
                }}
              >
                <div className="inline-flex items-center gap-3 mb-6">
                  {getFileIcon(file.name)}
                  <div className="text-left">
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-white/40 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFile(null)}
                    className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-white/80 transition-colors"
                  >
                    Remove
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={cn(
                      "px-6 py-2 rounded-lg font-medium transition-all",
                      "bg-gradient-to-r from-indigo-500 to-rose-500",
                      "hover:shadow-lg hover:shadow-indigo-500/25",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Verify Citations"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/[0.08]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Document Analysis</h3>
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>

            {/* Metadata */}
            {result.metadata && (
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-white/[0.02]">
                <div>
                  <div className="text-white/40 text-xs mb-1">Extraction</div>
                  <div className="text-white text-sm capitalize">
                    {result.metadata.extraction_method.replace('_', ' ')}
                  </div>
                </div>
                {result.metadata.pages && (
                  <div>
                    <div className="text-white/40 text-xs mb-1">Pages</div>
                    <div className="text-white text-sm">{result.metadata.pages}</div>
                  </div>
                )}
                <div>
                  <div className="text-white/40 text-xs mb-1">Text Length</div>
                  <div className="text-white text-sm">{result.metadata.text_length} chars</div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="text-center p-4 rounded-lg bg-indigo-500/10 mb-6">
              <div className="text-3xl font-bold text-indigo-300 mb-1">
                {result.citations_found}
              </div>
              <div className="text-white/60 text-sm">Citations Found</div>
            </div>

            {/* Verification Summary */}
            {result.summary && (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {result.summary.verified}
                  </div>
                  <div className="text-white/60 text-xs">Verified</div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 text-center">
                  <div className="text-2xl font-bold text-yellow-300">
                    {result.summary.suspicious}
                  </div>
                  <div className="text-white/60 text-xs">Suspicious</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 text-center">
                  <div className="text-2xl font-bold text-red-300">
                    {result.summary.failed}
                  </div>
                  <div className="text-white/60 text-xs">Failed</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}