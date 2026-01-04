"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface VerificationResult {
  layer: string;
  score: number;
  status: string;
}

interface VerificationChartProps {
  results: VerificationResult[];
}

export default function VerificationChart({ results }: VerificationChartProps) {
  // Prepare data for radar chart
  const radarData = results.map(r => ({
    layer: r.layer,
    score: Math.round(r.score * 100),
    fullMark: 100
  }));

  // Prepare data for bar chart
  const barData = results.map(r => ({
    layer: r.layer,
    score: Math.round(r.score * 100),
    status: r.status
  }));

  // Color mapping for statuses
  const getColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return '#10b981'; // green
      case 'warning':
        return '#f59e0b'; // orange
      case 'failed':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Overall Confidence Score */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Overall Confidence Score
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length * 100)}%
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            <p className="text-sm">Based on {results.length} verification layers</p>
            <p className="text-xs mt-1">
              {results.filter(r => r.status === 'passed').length} passed, 
              {results.filter(r => r.status === 'warning').length} warnings,
              {results.filter(r => r.status === 'failed').length} failed
            </p>
          </div>
        </div>
      </div>

      {/* Radar Chart - Visual Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Layer-by-Layer Analysis
        </h4>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="layer" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#6b7280' }}
            />
            <Radar
              name="Confidence Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Detailed Scores */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Confidence by Layer
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="layer" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#6b7280' }}
              label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Layer Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Verification Details
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Layer</th>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Score</th>
                <th className="pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <td className="py-4 text-sm text-gray-900 dark:text-white font-medium">
                    {result.layer}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getColor(result.status) }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {Math.round(result.score * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        result.status === 'passed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : result.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {result.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
