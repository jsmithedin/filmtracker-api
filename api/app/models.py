from enum import Enum
from typing import Optional
from datetime import date
from uuid import UUID
import uuid6
from sqlmodel import Field, SQLModel
from pydantic import ConfigDict

class FilmType(str, Enum):
    bw = "BW"
    colour = "Colour"
    colour_reversal = "Colour Reversal"

class FilmFormat(str, Enum):
    format_120 = "120"
    format_35mm = "35mm"
    format_4x5 = "4x5"
    instant = "Instant"

class Film(SQLModel, table=True):
    model_config = ConfigDict(use_enum_values=True)
    id: UUID = Field(default_factory=uuid6.uuid6, primary_key=True)
    manufacturer: str
    name: str
    type: FilmType = Field(sa_column_kwargs={"nullable": False})
    format: FilmFormat = Field(sa_column_kwargs={"nullable": False})
    iso: int
    quantity: int = 0


class FilmUseBase(SQLModel):
    """Base fields for logging a roll of film usage."""

    date_used: date
    film_id: UUID = Field(foreign_key="film.id")
    camera: str
    location: str
    developer: str
    notes: Optional[str] = None


class FilmUse(FilmUseBase, table=True):
    id: UUID = Field(default_factory=uuid6.uuid6, primary_key=True)


class FilmUseCreate(FilmUseBase):
    pass


class FilmUseUpdate(SQLModel):
    """Fields that can be updated for a film use."""

    date_used: Optional[date] = None
    film_id: Optional[UUID] = None
    camera: Optional[str] = None
    location: Optional[str] = None
    developer: Optional[str] = None
    notes: Optional[str] = None
