from fastapi import FastAPI
from sqlmodel import SQLModel

from .database import engine
from .routers import films

app = FastAPI(title="Film Tracker API")
app.include_router(films.router)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
