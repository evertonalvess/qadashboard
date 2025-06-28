from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
from datetime import datetime, timedelta
from typing import List
import os

# Placeholder imports for RAG
from sentence_transformers import SentenceTransformer
from llama_index import VectorStoreIndex, SimpleDirectoryReader
from qdrant_client import QdrantClient
import requests

SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
qdrant_client = QdrantClient(url="qdrant:6333")
embed_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/auth/login")
async def login(form_data: dict):
    username = form_data.get("username")
    password = form_data.get("password")
    if username != "admin" or password != "admin":
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token({"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), user: str = Depends(get_current_user)):
    path = os.path.join("/tmp", file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    # TODO: extract text and add to qdrant
    return {"filename": file.filename}


@app.post("/jira/import")
async def import_jira(file: UploadFile = File(...), user: str = Depends(get_current_user)):
    path = os.path.join("/tmp", file.filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    # TODO: parse CSV/JSON and store
    return {"status": "ok"}


@app.post("/ask")
async def ask_question(question: str, user: str = Depends(get_current_user)):
    # TODO: query qdrant via llamaindex
    context = ""
    payload = {"model": "mistral", "prompt": question + "\n" + context}
    resp = requests.post("http://ollama:11434/api/generate", json=payload)
    answer = resp.json().get("response")
    return {"answer": answer, "context": context}
