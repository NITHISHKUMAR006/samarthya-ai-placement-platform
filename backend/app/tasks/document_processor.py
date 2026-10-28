import io
from typing import List, Dict, Any
from pypdf import PdfReader
from pptx import Presentation
from app.ai.embedding_service import embedding_service
from app.core.logging import logger


class DocumentProcessor:
    def extract_text(self, file_bytes: bytes, filename: str) -> str:
        """Extract plain text from PDF or PPT/PPTX file bytes."""
        extension = filename.lower().split(".")[-1]
        text_parts: List[str] = []

        try:
            if extension == "pdf":
                reader = PdfReader(io.BytesIO(file_bytes))
                for page_idx, page in enumerate(reader.pages):
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(f"[Page {page_idx + 1}]\n{page_text.strip()}")
            elif extension in ["ppt", "pptx"]:
                prs = Presentation(io.BytesIO(file_bytes))
                for slide_idx, slide in enumerate(prs.slides):
                    slide_texts = []
                    for shape in slide.shapes:
                        if hasattr(shape, "text") and shape.text:
                            slide_texts.append(shape.text.strip())
                    if slide_texts:
                        text_parts.append(f"[Slide {slide_idx + 1}]\n" + "\n".join(slide_texts))
            else:
                # Text or markdown
                text_parts.append(file_bytes.decode("utf-8", errors="ignore"))
        except Exception as e:
            logger.error(f"Error extracting text from {filename}: {e}")
            raise ValueError(f"Failed to extract document contents: {str(e)}")

        return "\n\n".join(text_parts)

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Split document text into sliding chunks with configurable overlap."""
        if not text:
            return []

        chunks: List[str] = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = min(start + chunk_size, text_len)
            # Try to break at a newline or space if not at end
            if end < text_len:
                last_newline = text.rfind("\n", start, end)
                if last_newline != -1 and last_newline > start + (chunk_size // 2):
                    end = last_newline
                else:
                    last_space = text.rfind(" ", start, end)
                    if last_space != -1 and last_space > start + (chunk_size // 2):
                        end = last_space

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            if end >= text_len:
                break
            start = end - overlap if end - overlap > start else end

        return chunks

    async def process_document(self, file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """Extract text, chunk it, and compute embeddings where available."""
        full_text = self.extract_text(file_bytes, filename)
        chunks = self.chunk_text(full_text)

        processed_chunks: List[Dict[str, Any]] = []
        for idx, chunk in enumerate(chunks):
            embedding = await embedding_service.generate_embedding(chunk)
            processed_chunks.append({
                "chunk_index": idx,
                "content": chunk,
                "embedding": embedding,
                "metadata": {
                    "source": filename,
                    "char_count": len(chunk),
                }
            })

        logger.info(f"Processed document '{filename}': generated {len(processed_chunks)} chunks.")
        return processed_chunks


document_processor = DocumentProcessor()
