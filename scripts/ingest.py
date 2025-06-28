"""Script to ingest files and store embeddings in Qdrant."""
import sys
from pathlib import Path
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import pdfplumber
import markdown
from docx import Document

qdrant = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
COLLECTION = 'documents'


def extract_text(path: Path) -> str:
    if path.suffix.lower() == '.pdf':
        with pdfplumber.open(path) as pdf:
            return "\n".join(page.extract_text() or '' for page in pdf.pages)
    if path.suffix.lower() in {'.md', '.markdown'}:
        return markdown.markdown(path.read_text())
    if path.suffix.lower() in {'.docx', '.doc'}:
        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs)
    return path.read_text()


def ingest_file(path: Path):
    text = extract_text(path)
    embeddings = model.encode([text])[0]
    qdrant.upsert(
        collection_name=COLLECTION,
        points=[{
            'id': path.name,
            'vector': embeddings.tolist(),
            'payload': {'path': str(path)}
        }]
    )


def main(paths: list[str]):
    for p in paths:
        ingest_file(Path(p))


if __name__ == '__main__':
    main(sys.argv[1:])
