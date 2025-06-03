from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List

from uuid import UUID
from ..models import FilmUse, FilmUseCreate, FilmUseUpdate
from ..database import get_session

router = APIRouter(prefix="/uses", tags=["film uses"])


@router.get("/", response_model=List[FilmUse])
def list_uses(session=Depends(get_session)):
    uses = session.exec(select(FilmUse)).all()
    return uses


@router.post("/", response_model=FilmUse, status_code=201)
def create_use(use: FilmUseCreate, session=Depends(get_session)):
    film_use = FilmUse.model_validate(use.model_dump())
    session.add(film_use)
    session.flush()
    return film_use


@router.patch("/{use_id}", response_model=FilmUse)
def update_use(use_id: UUID, use: FilmUseUpdate, session=Depends(get_session)):
    film_use = session.get(FilmUse, use_id)
    if not film_use:
        raise HTTPException(status_code=404, detail="Film use not found")
    for key, value in use.model_dump(exclude_unset=True).items():
        setattr(film_use, key, value)
    session.add(film_use)
    return film_use
