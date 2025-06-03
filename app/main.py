from fastapi import FastAPI
from sqlmodel import SQLModel
from contextlib import asynccontextmanager

from .database import engine
from .routers import films


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title="Film Tracker API", lifespan=lifespan)
app.include_router(films.router)
