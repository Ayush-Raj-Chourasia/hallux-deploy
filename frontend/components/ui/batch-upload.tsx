"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { batchVerify, type BatchVerifyResponse, type VerificationResult } from "@/lib/api";

// Types
interface FileMetadata {
    id: string;
    file: File;
    status: "pending" | "processing" | "completed" | "error";
    progress: number;
    result?: BatchVerifyResponse;
    error?: string;
}

export function BatchUpload() {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle drag events
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    // Process files
    const processFiles = async (filesToProcess: File[]) => {
        // Generate IDs and initial state
        const newFiles = filesToProcess.map((file) => ({
            id: crypto.randomUUID(),
            file,
            status: "pending" as const,
            progress: 0,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
        setIsProcessing(true);

        for (const fileData of newFiles) {
            // Update status to processing
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileData.id ? { ...f, status: "processing", progress: 10 } : f
                )
            );

            try {
                const text = await fileData.file.text();
                let citations: string[] = [];

                // Simple parsing logic
                if (fileData.file.type === "application/json" || fileData.file.name.endsWith(".json")) {
                    try {
                        const json = JSON.parse(text);
                        if (Array.isArray(json)) {
                            citations = json.map(item => typeof item === 'string' ? item : item.citation_text || JSON.stringify(item));
                        } else {
                            citations = [JSON.stringify(json)];
                        }
                    } catch (e) {
                        throw new Error("Invalid JSON format");
                    }
                } else {
                    // Assume CSV or text, split by newlines
                    citations = text.split(/\r?\n/).filter(line => line.trim().length > 0);
                }

                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileData.id ? { ...f, progress: 50 } : f
                    )
                );

                // Call API
                const response = await batchVerify({
                    citations: citations.map(c => ({ citation_text: c })),
                    enable_parallel: true
                });

                // Update status to completed
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileData.id
                            ? { ...f, status: "completed", progress: 100, result: response }
                            : f
                    )
                );
            } catch (error) {
                console.error("Error processing file:", error);
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileData.id
                            ? { ...f, status: "error", error: error instanceof Error ? error.message : "Unknown error" }
                            : f
                    )
                );
            }
        }
        setIsProcessing(false);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Drop Zone */}
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
                    dragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    multiple
                    accept=".csv,.json,.txt"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center gap-4 pointer-events-none">
                    <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-400">
                        <Upload className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Drop files here or click to upload
                        </h3>
                        <p className="text-white/60 text-sm">
                            Support for CSV, JSON, and Text files
                        </p>
                    </div>
                </div>
            </div>

            {/* File Queue */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-white">Upload Queue</h3>
                        <div className="space-y-3">
                            {files.map((file) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <FileText className="h-8 w-8 text-indigo-400" />
                                        <div>
                                            <p className="text-white font-medium">{file.file.name}</p>
                                            <p className="text-white/40 text-xs">
                                                {(file.file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Status Indicator */}
                                        <div className="flex items-center gap-2">
                                            {file.status === "processing" && (
                                                <span className="flex items-center gap-2 text-yellow-400 text-sm">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Processing
                                                </span>
                                            )}
                                            {file.status === "completed" && (
                                                <span className="flex items-center gap-2 text-green-400 text-sm">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Done
                                                </span>
                                            )}
                                            {file.status === "error" && (
                                                <span className="flex items-center gap-2 text-red-400 text-sm">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Error
                                                </span>
                                            )}
                                            {file.status === "pending" && (
                                                <span className="text-white/40 text-sm">Pending</span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Table */}
            <AnimatePresence>
                {files.some((f) => f.result) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Batch Results</h3>
                            <button
                                // TODO: Implement Export
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                                onClick={() => {
                                    // Simple CSV Export
                                    const csvContent = "data:text/csv;charset=utf-8,"
                                        + "Citation,Status,Confidence,Reasoning\n"
                                        + files.flatMap(f => f.result?.results.map(r =>
                                            `"${r.citation.replace(/"/g, '""')}","${r.status}","${r.confidence}","${(r.ai_reasoning || '').replace(/"/g, '""')}"`
                                        ) || []).join("\n");
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "batch-results.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </button>
                        </div>

                        <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-white/60">
                                    <thead className="bg-white/5 text-white font-medium">
                                        <tr>
                                            <th className="p-4">Citation</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Confidence</th>
                                            <th className="p-4">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {files.flatMap((f) =>
                                            f.result?.results.map((r, idx) => (
                                                <tr key={`${f.id}-${idx}`} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 max-w-xs truncate" title={r.citation}>
                                                        {r.citation}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={cn(
                                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                                                r.status === "verified"
                                                                    ? "bg-green-500/10 text-green-400"
                                                                    : r.status === "suspicious"
                                                                        ? "bg-yellow-500/10 text-yellow-400"
                                                                        : "bg-red-500/10 text-red-400"
                                                            )}
                                                        >
                                                            {r.status === "verified" ? (
                                                                <CheckCircle2 className="h-3 w-3" />
                                                            ) : r.status === "suspicious" ? (
                                                                <AlertCircle className="h-3 w-3" />
                                                            ) : (
                                                                <AlertCircle className="h-3 w-3" />
                                                            )}
                                                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        "h-full rounded-full",
                                                                        r.confidence > 80
                                                                            ? "bg-green-500"
                                                                            : r.confidence > 50
                                                                                ? "bg-yellow-500"
                                                                                : "bg-red-500"
                                                                    )}
                                                                    style={{ width: `${r.confidence}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs">{Math.round(r.confidence)}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 max-w-xs truncate" title={r.ai_reasoning || r.verification_layers.content_verification.details}>
                                                        {r.ai_reasoning || r.verification_layers.content_verification.details}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
