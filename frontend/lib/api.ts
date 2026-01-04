// API Client for Hallux Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Citation {
  citation_text: string;
  doi?: string;
  url?: string;
  context?: string;
}

export type VerificationStatus = "verified" | "suspicious" | "fake" | "url_broken" | "unknown";

export interface LayerResult {
  status: string;
  details: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface VerificationLayers {
  url_validation: LayerResult;
  metadata_check: LayerResult;
  content_verification: LayerResult;
  ai_scoring: LayerResult;
  citation_graph?: LayerResult;
}

export interface VerificationResult {
  citation: string;
  status: VerificationStatus;
  confidence: number;
  verification_layers: VerificationLayers;
  ai_reasoning?: string;
  suggestions?: any[];
  metadata: Record<string, any>;
}

export interface VerifyTextRequest {
  text: string;
  enable_ai_analysis?: boolean;
}

export interface VerifyTextResponse {
  total_citations: number;
  verified_count: number;
  suspicious_count: number;
  fake_count: number;
  results: VerificationResult[];
  overall_confidence: number;
  processing_time_ms: number;
  timestamp: string;
}

export interface BatchVerifyRequest {
  citations: Citation[];
  enable_parallel?: boolean;
}

export interface BatchVerifyResponse {
  total_citations: number;
  results: VerificationResult[];
  summary: {
    verified: number;
    suspicious: number;
    failed: number;
  };
  processing_time: number;
  timestamp: string;
}

export interface CitationHealthResponse {
  citation_id: string;
  status: string;
  confidence_score: number;
  last_verified: string;
  verification_count: number;
  trend: string;
}

/**
 * Verify a single citation
 */
export async function verifyCitation(citation: Citation): Promise<VerificationResult> {
  const response = await fetch(`${API_BASE_URL}/api/verify-citation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(citation),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Verify citations within a text block
 */
export async function verifyText(request: VerifyTextRequest): Promise<VerifyTextResponse> {
  const response = await fetch(`${API_BASE_URL}/api/verify-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Batch verify multiple citations
 */
export async function batchVerify(request: BatchVerifyRequest): Promise<BatchVerifyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/batch-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get citation health status
 */
export async function getCitationHealth(citationId: string): Promise<CitationHealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/citation-health/${citationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Health check for API
 */
export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
