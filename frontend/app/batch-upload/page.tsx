"use client";

import { BatchUpload } from "@/components/ui/batch-upload";

export default function BatchUploadPage() {
    return (
        <div className="min-h-screen bg-[#030303] py-24 px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Batch Verification</h1>
                <BatchUpload />
            </div>
        </div>
    );
}
