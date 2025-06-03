# Film Tracker API

This project provides a FastAPI service for tracking camera film inventory. It uses **SQLModel** for ORM and **Alembic** for migrations. The project can run locally or in Docker using Postgres.

## Development

Install dependencies using [uv](https://github.com/astral-sh/uv):

```bash
uv pip install -r requirements.txt
uv pip install -r requirements-test.txt
```

Run the API:

```bash
uvicorn app.main:app --reload
```

## Docker

The included `docker-compose.yml` starts the API and a Postgres database. The
database stores its data in the named volume `db-data` so records remain even
after restarting the stack:

```bash
docker compose up --build
```

To restart the stack without losing data, run:

```bash
docker compose down
docker compose up
```

The volume keeps the Postgres data between runs.

## Tests

Tests use pytest:

```bash
pytest
```

The repository includes a GitHub Actions workflow that installs dependencies
with **uv** and runs the test suite on every push and pull request.
