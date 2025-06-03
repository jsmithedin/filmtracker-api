from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

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
    id: Optional[int] = Field(default=None, primary_key=True)
    manufacturer: str
    name: str
    type: FilmType = Field(sa_column_kwargs={"nullable": False})
    format: FilmFormat = Field(sa_column_kwargs={"nullable": False})
    iso: int
    quantity: int = 0
