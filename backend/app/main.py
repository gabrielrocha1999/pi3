from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.core.config import settings
import app.models  # noqa: F401 — registra modelos para criação das tabelas
from app.core.database import Base
from app.controllers import (
    produto_controller,
    venda_controller,
    despesa_controller,
    dashboard_controller,
    external_controller,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="API REST para gestão financeira e controle de estoque para microempresas",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_controller.router)
app.include_router(produto_controller.router)
app.include_router(venda_controller.router)
app.include_router(despesa_controller.router)
app.include_router(external_controller.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.app_name}
