import os
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

from app.main import app
from app.database import get_session

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://film:film@localhost:5432/filmdb")

@pytest.fixture(name="session")
def session_fixture():
    try:
        engine = create_engine(DATABASE_URL)
        SQLModel.metadata.create_all(engine)
    except Exception:
        pytest.skip("Postgres server not available")
        return
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        yield session
    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_films_endpoints(client):
    film_data = {
        "manufacturer": "Kodak",
        "name": "Ektar 100",
        "type": "Colour",
        "format": "35mm",
        "iso": 100,
        "quantity": 3,
    }
    resp = client.post("/films/", json=film_data)
    assert resp.status_code == 201
    data = resp.json()
    film_id = data["id"]

    resp = client.get("/films/")
    assert resp.status_code == 200
    films = resp.json()
    assert any(f["id"] == film_id for f in films)

    resp = client.patch(f"/films/{film_id}", params={"quantity": 7})
    assert resp.status_code == 200
    assert resp.json()["quantity"] == 7


def test_uses_endpoints(client):
    film_data = {
        "manufacturer": "Ilford",
        "name": "HP5+",
        "type": "BW",
        "format": "35mm",
        "iso": 400,
    }
    film_resp = client.post("/films/", json=film_data)
    film_id = film_resp.json()["id"]

    use_data = {
        "date_used": "2025-01-01",
        "film_id": film_id,
        "camera": "Nikon F3",
        "location": "London",
        "developer": "D76",
    }
    resp = client.post("/uses/", json=use_data)
    assert resp.status_code == 201
    use_id = resp.json()["id"]

    resp = client.get("/uses/")
    assert resp.status_code == 200
    uses = resp.json()
    assert any(u["id"] == use_id for u in uses)

    patch_resp = client.patch(f"/uses/{use_id}", json={"notes": "Updated"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["notes"] == "Updated"
