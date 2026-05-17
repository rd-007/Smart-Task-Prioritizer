# Smart Task Prioritizer — AI Service
# Dockerfile for Railway deployment

FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code (venv excluded via .dockerignore)
COPY . .

# Railway dynamically assigns PORT — default to 8000 for local
ENV PORT=8000

# Expose the port
EXPOSE ${PORT}

# Health check using the dynamically assigned port
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://localhost:{os.environ.get(\"PORT\", 8000)}/health')" || exit 1

# Run with uvicorn — bind to 0.0.0.0 on Railway's PORT
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
