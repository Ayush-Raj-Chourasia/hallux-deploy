"""
Core Citation Verification Service
Implements 5-layer verification system
"""

import re
import asyncio
from typing import List, Optional, Dict, Any
from loguru import logger
from datetime import datetime
import httpx

from app.models.schemas import (
    VerificationResult,
    TextVerificationResult,
    BatchVerificationResult,
    VerificationStatus,
    LayerStatus,
    LayerResult,
    VerificationLayers,
    VerificationOptions,
    CitationSuggestion,
)
from app.services.ai_service import ai_service
from app.services.hallucination_models import hallucination_detector
from app.services.advanced_verification import advanced_verifier


class VerificationService:
    """Main verification service orchestrating all layers"""
    
    def __init__(self):
        self.citation_patterns = [
            # DOI pattern
            r'10\.\d{4,9}/[-._;()/:A-Za-z0-9]+',
            # arXiv pattern
            r'arXiv:\d{4}\.\d{4,5}',
            # URL pattern
            r'https?://[^\s<>"{}|\\^`\[\]]+',
            # Author (Year) pattern
            r'[A-Z][a-z]+\s+et\s+al\.\s+\(\d{4}\)',
            r'[A-Z][a-z]+\s+and\s+[A-Z][a-z]+\s+\(\d{4}\)',
            # Common citation formats
            r'\[\d+\]',  # [1], [2], etc.
        ]
    
    async def verify_single_citation(
        self,
        citation: str,
        context: Optional[str] = None,
        options: VerificationOptions = VerificationOptions()
    ) -> VerificationResult:
        """
        Verify a single citation using all available layers
        
        Layers:
        1. URL Validation
        2. Metadata Cross-check
        3. Content Verification
        4. AI Confidence Scoring
        5. Citation Graph Analysis
        """
        logger.info(f"Starting verification for: {citation[:100]}")
        
        # Run verification layers in parallel where possible
        tasks = []
        
        # Layer 1: URL Validation (fast, always run first)
        url_result = await self._verify_url(citation)
        
        # Layer 2: Metadata Check (parallel with Layer 3)
        tasks.append(self._verify_metadata(citation))
        
        # Layer 3: Content Verification (if enabled)
        if options.check_content:
            tasks.append(self._verify_content(citation, context))
        else:
            tasks.append(self._skip_layer("content_verification", "Disabled by options"))
        
        # Run parallel tasks
        metadata_result, content_result = await asyncio.gather(*tasks)
        
        # Layer 4: AI Scoring (after other layers complete)
        if options.enable_ai_scoring:
            ai_result = await self._ai_confidence_scoring(
                citation, context, url_result, metadata_result, content_result
            )
        else:
            ai_result = await self._skip_layer("ai_scoring", "Disabled by options")
        
        # Layer 5: Citation Graph (optional, slower)
        if options.enable_citation_graph:
            graph_result = await self._citation_graph_analysis(citation)
        else:
            graph_result = None
        
        # Aggregate results
        verification_layers = VerificationLayers(
            url_validation=url_result,
            metadata_check=metadata_result,
            content_verification=content_result,
            ai_scoring=ai_result,
            citation_graph=graph_result,
        )
        
        # Calculate overall status and confidence
        status, confidence = self._calculate_overall_status(verification_layers)
        
        # Generate AI reasoning
        ai_reasoning = self._generate_reasoning(verification_layers, status, confidence)
        
        # Generate suggestions if citation is suspicious/fake
        suggestions = []
        if status in [VerificationStatus.SUSPICIOUS, VerificationStatus.FAKE]:
            suggestions = await self._generate_suggestions(citation)
        
        return VerificationResult(
            citation=citation,
            status=status,
            confidence=confidence,
            verification_layers=verification_layers,
            ai_reasoning=ai_reasoning,
            suggestions=suggestions,
            metadata={
                "processing_time_ms": 0,  # Will be set by API handler
                "timestamp": datetime.utcnow().isoformat(),
            },
        )
    
    async def verify_text(
        self,
        text: str,
        format: str = "plain",
        options: VerificationOptions = VerificationOptions()
    ) -> TextVerificationResult:
        """
        Extract and verify all citations in a text document
        """
        logger.info(f"Extracting citations from text ({len(text)} chars)")
        
        # Extract citations
        citations = self._extract_citations(text, format)
        logger.info(f"Found {len(citations)} potential citations")
        
        if not citations:
            return TextVerificationResult(
                total_citations=0,
                verified_count=0,
                suspicious_count=0,
                fake_count=0,
                results=[],
                overall_confidence=100.0,
                processing_time_ms=0,
            )
        
        # Verify each citation
        results = []
        for citation in citations[:20]:  # Limit to first 20 for demo
            try:
                result = await self.verify_single_citation(citation, None, options)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to verify citation: {e}")
        
        # Calculate statistics
        verified_count = sum(1 for r in results if r.status == VerificationStatus.VERIFIED)
        suspicious_count = sum(1 for r in results if r.status == VerificationStatus.SUSPICIOUS)
        fake_count = sum(1 for r in results if r.status == VerificationStatus.FAKE)
        overall_confidence = sum(r.confidence for r in results) / len(results) if results else 0
        
        return TextVerificationResult(
            total_citations=len(citations),
            verified_count=verified_count,
            suspicious_count=suspicious_count,
            fake_count=fake_count,
            results=results,
            overall_confidence=round(overall_confidence, 2),
            processing_time_ms=0,
        )
    
    async def batch_verify(
        self,
        citations: List[str],
        priority: str = "balanced",
        options: VerificationOptions = VerificationOptions()
    ) -> BatchVerificationResult:
        """
        Batch verify multiple citations with priority options
        """
        logger.info(f"Batch verifying {len(citations)} citations (priority: {priority})")
        
        # Adjust options based on priority
        if priority == "speed":
            options.enable_ai_scoring = False
            options.enable_citation_graph = False
            options.check_content = False
        elif priority == "accuracy":
            options.enable_ai_scoring = True
            options.enable_citation_graph = True
            options.check_content = True
        
        # Verify citations in parallel (with concurrency limit)
        results = []
        failed = 0
        
        # Process in batches of 10 to avoid overwhelming external APIs
        batch_size = 10
        for i in range(0, len(citations), batch_size):
            batch = citations[i:i+batch_size]
            tasks = [self.verify_single_citation(c, None, options) for c in batch]
            
            try:
                batch_results = await asyncio.gather(*tasks, return_exceptions=True)
                for result in batch_results:
                    if isinstance(result, Exception):
                        failed += 1
                        logger.error(f"Citation verification failed: {result}")
                    else:
                        results.append(result)
            except Exception as e:
                logger.error(f"Batch processing error: {e}")
                failed += len(batch)
        
        return BatchVerificationResult(
            total_citations=len(citations),
            completed=len(results),
            failed=failed,
            results=results,
            processing_time_ms=0,
        )
    
    # ========== LAYER 1: URL VALIDATION ==========
    
    async def _verify_url(self, citation: str) -> LayerResult:
        """
        Layer 1: Validate URLs in citation
        Checks HTTP status, SSL, domain reputation
        """
        logger.debug("Layer 1: URL Validation")
        
        # Extract URLs from citation
        urls = re.findall(r'https?://[^\s<>"{}|\\^`\[\]]+', citation)
        
        if not urls:
            return LayerResult(
                status=LayerStatus.SKIPPED,
                details="No URLs found in citation",
                confidence=None,
            )
        
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                for url in urls[:3]:  # Check first 3 URLs only
                    try:
                        response = await client.head(url)
                        
                        if response.status_code == 200:
                            return LayerResult(
                                status=LayerStatus.PASSED,
                                details=f"URL accessible: {url} (Status: {response.status_code})",
                                confidence=0.95,
                                metadata={"url": url, "status_code": response.status_code},
                            )
                        elif 400 <= response.status_code < 500:
                            return LayerResult(
                                status=LayerStatus.FAILED,
                                details=f"URL broken: {url} (Status: {response.status_code})",
                                confidence=0.1,
                                metadata={"url": url, "status_code": response.status_code},
                            )
                    except httpx.RequestError as e:
                        logger.warning(f"URL check failed for {url}: {e}")
                        continue
            
            return LayerResult(
                status=LayerStatus.WARNING,
                details="URLs found but could not verify",
                confidence=0.5,
            )
        
        except Exception as e:
            logger.error(f"URL validation error: {e}")
            return LayerResult(
                status=LayerStatus.WARNING,
                details=f"URL validation error: {str(e)}",
                confidence=0.5,
            )
    
    # ========== LAYER 2: METADATA CROSS-CHECK ==========
    
    async def _verify_metadata(self, citation: str) -> LayerResult:
        """
        Layer 2: Check DOI, arXiv, ISBN against databases
        Uses Crossref, arXiv, OpenAlex APIs
        ✨ NOW WITH REAL API INTEGRATION (Gemini Suggestion)
        """
        logger.debug("Layer 2: Metadata Cross-check")
        
        # Check for DOI - NOW WITH REAL CROSSREF VERIFICATION
        doi_match = re.search(r'10\.\d{4,9}/[-._;()/:A-Za-z0-9]+', citation)
        if doi_match:
            doi = doi_match.group(0)
            logger.info(f"Found DOI: {doi} - Verifying with Crossref...")
            
            try:
                result = await advanced_verifier.verify_doi_with_crossref(doi, citation)
                
                if result["verified"]:
                    return LayerResult(
                        status=LayerStatus.PASSED,
                        details=result["reason"],
                        confidence=result["confidence"],
                        metadata={
                            "doi": doi,
                            "source": "crossref",
                            "title": result.get("actual_title"),
                            "authors": result.get("actual_authors"),
                            "year": result.get("actual_year")
                        },
                    )
                else:
                    return LayerResult(
                        status=LayerStatus.FAILED if result["confidence"] < 0.3 else LayerStatus.WARNING,
                        details=result["reason"],
                        confidence=result["confidence"],
                        metadata={"doi": doi, "mismatches": result.get("mismatches", [])},
                    )
            except Exception as e:
                logger.error(f"Crossref verification failed: {e}")
                # Fallback to basic check
                return LayerResult(
                    status=LayerStatus.WARNING,
                    details=f"DOI found but verification failed: {str(e)}",
                    confidence=0.5,
                    metadata={"doi": doi},
                )
        
        # Check for arXiv ID - NOW WITH REAL ARXIV API
        arxiv_match = re.search(r'arXiv:(\d{4}\.\d{4,5})', citation)
        if arxiv_match:
            arxiv_id = arxiv_match.group(1)
            logger.info(f"Found arXiv ID: {arxiv_id} - Verifying with arXiv API...")
            
            try:
                result = await advanced_verifier.verify_arxiv_id(arxiv_id)
                
                if result["verified"]:
                    return LayerResult(
                        status=LayerStatus.PASSED,
                        details=result["reason"],
                        confidence=result["confidence"],
                        metadata={"arxiv_id": arxiv_id, "title": result.get("title")},
                    )
                else:
                    return LayerResult(
                        status=LayerStatus.FAILED,
                        details=result["reason"],
                        confidence=result["confidence"],
                        metadata={"arxiv_id": arxiv_id},
                    )
            except Exception as e:
                logger.error(f"arXiv verification failed: {e}")
                return LayerResult(
                    status=LayerStatus.WARNING,
                    details=f"arXiv ID found but verification failed: {str(e)}",
                    confidence=0.5,
                    metadata={"arxiv_id": arxiv_id},
                )
        
        # No identifiable metadata
        return LayerResult(
            status=LayerStatus.WARNING,
            details="No DOI or arXiv ID found",
            confidence=0.4,
        )
    
    # ========== LAYER 3: CONTENT VERIFICATION ==========
    
    async def _verify_content(self, citation: str, context: Optional[str]) -> LayerResult:
        """
        Layer 3: Verify citation content matches source
        Uses web scraping and semantic similarity
        ✨ NOW WITH REAL PLAYWRIGHT SCRAPING + EMBEDDINGS
        """
        logger.debug("Layer 3: Content Verification")
        
        # Extract URL for scraping
        urls = re.findall(r'https?://[^\s<>"{}|\\^`\[\]]+', citation)
        
        if not urls or not context:
            return LayerResult(
                status=LayerStatus.SKIPPED,
                details="No URL or context provided for content verification",
                confidence=None,
            )
        
        url = urls[0]
        
        try:
            # Use advanced verifier for semantic comparison
            result = await advanced_verifier.scrape_and_compare_content(url, context)
            
            if result["aligned"]:
                return LayerResult(
                    status=LayerStatus.PASSED,
                    details=result["reason"],
                    confidence=result["confidence"],
                    metadata={
                        "url": url,
                        "similarity_score": result.get("similarity_score"),
                        "content_length": result.get("content_length")
                    },
                )
            else:
                return LayerResult(
                    status=LayerStatus.WARNING if result["confidence"] > 0.4 else LayerStatus.FAILED,
                    details=result["reason"],
                    confidence=result["confidence"],
                    metadata={
                        "url": url,
                        "similarity_score": result.get("similarity_score"),
                        "flags": result.get("flags", [])
                    },
                )
        except Exception as e:
            logger.error(f"Content verification error: {e}")
            return LayerResult(
                status=LayerStatus.WARNING,
                details=f"Content verification failed: {str(e)}",
                confidence=0.5,
                metadata={"url": url},
            )
    
    # ========== LAYER 4: AI CONFIDENCE SCORING ==========
    
    async def _ai_confidence_scoring(
        self,
        citation: str,
        context: Optional[str],
        url_result: LayerResult,
        metadata_result: LayerResult,
        content_result: LayerResult,
    ) -> LayerResult:
        """
        Layer 4: AI analyzes citation for hallucination patterns
        Uses GPT-4/Gemini to provide reasoning
        ✨ NOW WITH TEMPORAL CONSISTENCY CHECK (Gemini Deep Think Feature)
        """
        logger.debug("Layer 4: AI Confidence Scoring + Advanced Checks")
        
        try:
            # GEMINI SUGGESTION: Temporal consistency check (time-travel detection)
            temporal_check = advanced_verifier.check_temporal_consistency(citation, context)
            
            # Prepare verification data for AI analysis
            verification_data = {
                "url_status": url_result.status.value,
                "metadata_status": metadata_result.status.value,
                "content_confidence": content_result.confidence if content_result.confidence else "N/A",
            }
            
            # Use AI service for actual analysis
            ai_result = await ai_service.analyze_citation_confidence(
                citation=citation,
                context=context,
                verification_data=verification_data
            )
            
            # Combine temporal check with AI analysis
            combined_confidence = ai_result.confidence if ai_result.confidence else 0.5
            reasoning_parts = [ai_result.details]
            
            if not temporal_check["passed"]:
                combined_confidence = min(combined_confidence, 0.2)  # Severe penalty for temporal violations
                reasoning_parts.extend(temporal_check["flags"])
            
            return LayerResult(
                status=LayerStatus.PASSED if combined_confidence > 0.7 else LayerStatus.WARNING,
                details=" | ".join(reasoning_parts),
                confidence=combined_confidence,
                metadata={
                    **ai_result.metadata,
                    "temporal_check": temporal_check
                },
            )
        except Exception as e:
            logger.error(f"AI scoring error: {e}")
            return LayerResult(
                status=LayerStatus.WARNING,
                details=f"AI analysis unavailable: {str(e)}",
                confidence=0.5,
            )
    
    # ========== LAYER 5: CITATION GRAPH ANALYSIS ==========
    
    async def _citation_graph_analysis(self, citation: str) -> LayerResult:
        """
        Layer 5: Analyze citation relationships
        Checks if cited paper actually cites its references
        ✨ NOW WITH OPENALEX INTEGRATION (Gemini Suggestion)
        """
        logger.debug("Layer 5: Citation Graph Analysis")
        
        # Extract DOI for graph analysis
        doi_match = re.search(r'10\.\d{4,9}/[-._;()/:A-Za-z0-9]+', citation)
        if not doi_match:
            return LayerResult(
                status=LayerStatus.SKIPPED,
                details="No DOI found for citation graph analysis",
                confidence=None,
            )
        
        doi = doi_match.group(0)
        
        try:
            result = await advanced_verifier.check_citation_network(doi)
            
            if result["verified"]:
                return LayerResult(
                    status=LayerStatus.PASSED,
                    details=result["reason"],
                    confidence=result["confidence"],
                    metadata={
                        "cited_by_count": result.get("cited_by_count"),
                        "reputation_flags": result.get("reputation_flags")
                    },
                )
            else:
                return LayerResult(
                    status=LayerStatus.WARNING,
                    details=result["reason"],
                    confidence=result["confidence"],
                    metadata={"doi": doi},
                )
        except Exception as e:
            logger.error(f"Citation graph analysis error: {e}")
            return LayerResult(
                status=LayerStatus.WARNING,
                details=f"Citation graph analysis failed: {str(e)}",
                confidence=0.5,
            )
    
    # ========== HELPER METHODS ==========
    
    async def _skip_layer(self, layer_name: str, reason: str) -> LayerResult:
        """Skip a layer with reason"""
        return LayerResult(
            status=LayerStatus.SKIPPED,
            details=f"{layer_name}: {reason}",
            confidence=None,
        )
    
    def _extract_citations(self, text: str, format: str) -> List[str]:
        """Extract potential citations from text"""
        citations = []
        
        # Extract sentences that contain citation patterns
        sentences = re.split(r'[.!?]\s+', text)
        
        for sentence in sentences:
            for pattern in self.citation_patterns:
                if re.search(pattern, sentence):
                    citations.append(sentence.strip())
                    break
        
        return list(set(citations))  # Remove duplicates
    
    def _calculate_overall_status(
        self, layers: VerificationLayers
    ) -> tuple[VerificationStatus, float]:
        """Calculate overall verification status and confidence"""
        
        # Count passed/failed layers
        passed = sum(
            1 for layer in [
                layers.url_validation,
                layers.metadata_check,
                layers.content_verification,
                layers.ai_scoring,
            ]
            if layer.status == LayerStatus.PASSED
        )
        
        failed = sum(
            1 for layer in [
                layers.url_validation,
                layers.metadata_check,
                layers.content_verification,
                layers.ai_scoring,
            ]
            if layer.status == LayerStatus.FAILED
        )
        
        # Calculate confidence (average of all layer confidences)
        confidences = [
            layer.confidence
            for layer in [
                layers.url_validation,
                layers.metadata_check,
                layers.content_verification,
                layers.ai_scoring,
            ]
            if layer.confidence is not None
        ]
        
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.5
        confidence_percent = round(avg_confidence * 100, 2)
        
        # Determine status
        if failed >= 2:
            status = VerificationStatus.FAKE
        elif failed == 1 or passed <= 2:
            status = VerificationStatus.SUSPICIOUS
        elif layers.url_validation.status == LayerStatus.FAILED:
            status = VerificationStatus.URL_BROKEN
        else:
            status = VerificationStatus.VERIFIED
        
        return status, confidence_percent
    
    def _generate_reasoning(
        self, layers: VerificationLayers, status: VerificationStatus, confidence: float
    ) -> str:
        """Generate human-readable reasoning for the verdict"""
        
        reasons = []
        
        if layers.url_validation.status == LayerStatus.FAILED:
            reasons.append("❌ URL validation failed (broken link detected)")
        elif layers.url_validation.status == LayerStatus.PASSED:
            reasons.append("✅ URL is accessible")
        
        if layers.metadata_check.status == LayerStatus.PASSED:
            reasons.append("✅ DOI or arXiv ID verified")
        elif layers.metadata_check.status == LayerStatus.FAILED:
            reasons.append("❌ Metadata verification failed")
        elif layers.metadata_check.status == LayerStatus.WARNING:
            reasons.append("⚠️ No verifiable metadata found (no DOI/arXiv)")
        
        if layers.content_verification.confidence:
            sim = layers.content_verification.confidence
            if sim > 0.8:
                reasons.append(f"✅ High content similarity ({sim:.0%})")
            elif sim > 0.6:
                reasons.append(f"⚠️ Moderate content similarity ({sim:.0%})")
            else:
                reasons.append(f"❌ Low content similarity ({sim:.0%})")
        
        reasoning = f"""
This citation is {status.value} with {confidence}% confidence because:

{chr(10).join(f'  {r}' for r in reasons)}

Overall Assessment: {self._get_verdict_message(status, confidence)}
        """
        
        return reasoning.strip()
    
    def _get_verdict_message(self, status: VerificationStatus, confidence: float) -> str:
        """Get a verdict message based on status"""
        if status == VerificationStatus.VERIFIED:
            return "This citation appears legitimate and can be trusted."
        elif status == VerificationStatus.SUSPICIOUS:
            return "This citation has some red flags. Manual verification recommended."
        elif status == VerificationStatus.FAKE:
            return "This citation appears to be fabricated or incorrect."
        elif status == VerificationStatus.URL_BROKEN:
            return "The URL in this citation is broken or inaccessible."
        else:
            return "Unable to verify this citation."
    
    def _get_structure_assessment(self, citation: str) -> str:
        """Assess citation structure"""
        if len(citation) > 200:
            return "abnormally long"
        elif len(citation) < 20:
            return "too short"
        elif re.search(r'\d{4}', citation):  # Has year
            return "well-formed"
        else:
            return "incomplete"
    
    async def _generate_suggestions(self, citation: str) -> List[CitationSuggestion]:
        """Generate alternative citation suggestions"""
        
        # TODO: Implement actual suggestion generation
        # - Use semantic search on OpenAlex/Semantic Scholar
        # - Find similar papers
        # - Rank by relevance
        
        return [
            CitationSuggestion(
                title="Example Alternative Paper",
                authors=["Smith, J.", "Doe, A."],
                year=2023,
                doi="10.1234/example",
                url="https://example.com/paper",
                confidence=0.85,
                reason="Similar topic and methodology",
            )
        ]
