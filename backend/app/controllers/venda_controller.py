from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.venda_service import VendaService
from app.schemas.venda import VendaCreate, VendaResponse

router = APIRouter(prefix="/vendas", tags=["Vendas"])


@router.get("/", response_model=list[VendaResponse])
def listar_vendas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return VendaService(db).listar_vendas(skip, limit)


@router.get("/{venda_id}", response_model=VendaResponse)
def obter_venda(venda_id: int, db: Session = Depends(get_db)):
    return VendaService(db).obter_venda(venda_id)


@router.post("/", response_model=VendaResponse, status_code=status.HTTP_201_CREATED)
def registrar_venda(dados: VendaCreate, db: Session = Depends(get_db)):
    return VendaService(db).registrar_venda(dados)
