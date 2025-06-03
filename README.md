# Film Tracker API

This project provides a FastAPI service for tracking camera film inventory. It uses **SQLModel** for ORM and **Alembic** for migrations. The project can run locally or in Docker using Postgres.

## Development

The API lives in the `api` directory. Install dependencies using
[uv](https://github.com/astral-sh/uv):

```bash
uv pip install -r api/requirements.txt
uv pip install -r api/requirements-test.txt
```

Run the API from within the `api` directory:

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

## Frontend

A simple React frontend lives in the `frontend` folder. It is served from a
separate container defined in `docker-compose.yml`. When running the stack with
Docker Compose, the frontend will be available at <http://localhost:3000> and
proxies API requests to the FastAPI service. The UI is written in **TypeScript**
and uses the [shadcn/ui](https://ui.shadcn.com) component library with Tailwind
CSS. It provides forms to manage films and film usage records.

## Tests

From within the `api` directory, run the tests with pytest:

```bash
cd api
pytest
```

The repository includes a GitHub Actions workflow that installs dependencies
with **uv** and runs the test suite on every push and pull request.
