import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import get_session


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        yield session
    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_create_and_list_use(client):
    # create a film to reference
    film_data = {
        "manufacturer": "Ilford",
        "name": "HP5+",
        "type": "BW",
        "format": "35mm",
        "iso": 400,
    }
    film_resp = client.post("/films/", json=film_data)
    assert film_resp.status_code == 201
    film_id = film_resp.json()["id"]

    use_data = {
        "date_used": "2025-01-01",
        "film_id": film_id,
        "camera": "Nikon F3",
        "location": "London",
        "developer": "D76",
        "notes": "First roll of the year",
    }
    response = client.post("/uses/", json=use_data)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None

    response = client.get("/uses/")
    assert response.status_code == 200
    uses = response.json()
    assert len(uses) == 1
    assert uses[0]["camera"] == "Nikon F3"


def test_update_use(client):
    film_data = {
        "manufacturer": "Kodak",
        "name": "Gold 200",
        "type": "Colour",
        "format": "35mm",
        "iso": 200,
    }
    film_resp = client.post("/films/", json=film_data)
    film_id = film_resp.json()["id"]

    use_data = {
        "date_used": "2025-02-02",
        "film_id": film_id,
        "camera": "Canon AE-1",
        "location": "Paris",
        "developer": "C41",
    }
    use_resp = client.post("/uses/", json=use_data)
    use_id = use_resp.json()["id"]

    patch_resp = client.patch(f"/uses/{use_id}", json={"notes": "Updated"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["notes"] == "Updated"
