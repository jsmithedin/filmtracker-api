FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml requirements.txt ./
RUN pip install uv && uv pip install --system -r requirements.txt
COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app
CMD ["bash", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
