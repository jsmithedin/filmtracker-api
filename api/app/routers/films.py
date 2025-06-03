from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List
from uuid import UUID

from ..models import Film
from ..database import get_session

router = APIRouter(prefix="/films", tags=["films"])

@router.get("/", response_model=List[Film])
def list_films(session=Depends(get_session)):
    films = session.exec(select(Film)).all()
    return films

@router.post("/", response_model=Film, status_code=201)
def create_film(film: Film, session=Depends(get_session)):
    session.add(film)
    session.flush()  # get id
    return film

@router.patch("/{film_id}", response_model=Film)
def update_quantity(film_id: UUID, quantity: int, session=Depends(get_session)):
    # SQLModel stores UUID primary keys as strings when using Postgres.
    # Cast to ``str`` only for that dialect to avoid mismatched
    # comparisons while still supporting SQLite tests.
    if session.bind.dialect.name == "postgresql":
        film = session.get(Film, str(film_id))
    else:
        film = session.get(Film, film_id)
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")
    film.quantity = quantity
    session.add(film)
    return film
