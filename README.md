# Offline NotebookLM Clone

Este projeto cria um workspace colaborativo de notas com IA totalmente offline, inspirado no NotebookLM. Ele inclui frontend React, backend FastAPI, vetor store Qdrant e uso do modelo `mistral` via Ollama.

## Estrutura

- `frontend/` – aplicação React com TipTap e TailwindCSS
- `backend/` – API FastAPI para upload, importação do Jira, perguntas e autenticação
- `scripts/` – scripts de ingestão de documentos
- `docker/` – compose para subir Qdrant, Ollama e o backend

## Setup Rápido

1. Instale as dependências do frontend:

```bash
cd frontend
npm install
```

2. Construa o backend e Qdrant via Docker Compose:

```bash
cd docker
docker compose up --build
```

3. Acesse o frontend em `http://localhost:5173` e a API em `http://localhost:8000`.

Para ingestão manual de arquivos use:

```bash
python scripts/ingest.py caminho/do/arquivo.pdf
```

O sistema funciona 100% offline após o download inicial das imagens Docker e do modelo Ollama.
