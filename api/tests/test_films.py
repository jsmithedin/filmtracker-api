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

def test_create_and_list(client):
    film_data = {
        "manufacturer": "Kodak",
        "name": "Portra 400",
        "type": "Colour Reversal",
        "format": "35mm",
        "iso": 400,
        "quantity": 5,
    }
    response = client.post("/films/", json=film_data)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None

    response = client.get("/films/")
    assert response.status_code == 200
    films = response.json()
    assert len(films) == 1
    assert films[0]["name"] == "Portra 400"
