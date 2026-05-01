from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.despesa_service import DespesaService
from app.schemas.despesa import DespesaCreate, DespesaUpdate, DespesaResponse

router = APIRouter(prefix="/despesas", tags=["Despesas"])


@router.get("/", response_model=list[DespesaResponse])
def listar_despesas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return DespesaService(db).listar_despesas(skip, limit)


@router.get("/{despesa_id}", response_model=DespesaResponse)
def obter_despesa(despesa_id: int, db: Session = Depends(get_db)):
    return DespesaService(db).obter_despesa(despesa_id)


@router.post("/", response_model=DespesaResponse, status_code=status.HTTP_201_CREATED)
def criar_despesa(dados: DespesaCreate, db: Session = Depends(get_db)):
    return DespesaService(db).criar_despesa(dados)


@router.put("/{despesa_id}", response_model=DespesaResponse)
def atualizar_despesa(despesa_id: int, dados: DespesaUpdate, db: Session = Depends(get_db)):
    return DespesaService(db).atualizar_despesa(despesa_id, dados)


@router.delete("/{despesa_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_despesa(despesa_id: int, db: Session = Depends(get_db)):
    DespesaService(db).deletar_despesa(despesa_id)
