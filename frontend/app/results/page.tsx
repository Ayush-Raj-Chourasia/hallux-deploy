"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VerificationChart from '@/components/ui/verification-chart';
import ExportButton from '@/components/ui/export-button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function ResultsPage() {
  // Sample data - replace with actual API response
  const [verificationResult] = useState({
    citation: "Brown et al. (2020), 'Language Models are Few-Shot Learners', arXiv:2005.14165",
    status: "suspicious",
    confidence: 25.0,
    verification_layers: {
      url_validation: {
        status: "skipped",
        details: "No URLs found in citation",
        confidence: null
      },
      metadata_check: {
        status: "failed",
        details: "arXiv ID not found (Status: 301)",
        confidence: 0.0
      },
      content_verification: {
        status: "skipped",
        details: "No URL or context provided",
        confidence: null
      },
      ai_scoring: {
        status: "warning",
        details: "AI analysis completed with warnings",
        confidence: 0.5
      },
      citation_graph: {
        status: "skipped",
        details: "No DOI found",
        confidence: null
      }
    },
    ai_reasoning: "This citation is suspicious with 25.0% confidence...",
    metadata: {
      processing_time_ms: 1873,
      timestamp: new Date().toISOString()
    }
  });

  // Transform data for chart
  const chartData = Object.entries(verificationResult.verification_layers).map(([key, value]) => ({
    layer: key.replace(/_/g, ' ').toUpperCase(),
    score: value.confidence || 0,
    status: value.status
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'passed':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'suspicious':
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={48} />;
      case 'failed':
      case 'fake':
        return <XCircle className="text-red-500" size={48} />;
      default:
        return <AlertCircle className="text-gray-500" size={48} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Verification Results
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive citation analysis and verification report
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {getStatusIcon(verificationResult.status)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Status: {verificationResult.status.toUpperCase()}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">
                  {verificationResult.citation}
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {verificationResult.confidence}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Processing Time:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {verificationResult.metadata.processing_time_ms}ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ExportButton 
              data={verificationResult} 
              filename={`hallux-result-${Date.now()}`}
            />
          </div>
        </motion.div>

        {/* AI Reasoning */}
        {verificationResult.ai_reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              AI Analysis
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {verificationResult.ai_reasoning}
            </p>
          </motion.div>
        )}

        {/* Visualization Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VerificationChart results={chartData} />
        </motion.div>

        {/* Layer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-4"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Detailed Layer Analysis
          </h3>
          {Object.entries(verificationResult.verification_layers).map(([layerName, layerData], index) => (
            <motion.div
              key={layerName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {layerName.replace(/_/g, ' ').toUpperCase()}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {layerData.details}
                  </p>
                  {layerData.confidence !== null && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Confidence: {(layerData.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    layerData.status === 'passed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : layerData.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : layerData.status === 'failed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {layerData.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
