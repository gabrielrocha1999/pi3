from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.produto_service import ProdutoService
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return ProdutoService(db).listar_produtos(skip, limit)


@router.get("/{produto_id}", response_model=ProdutoResponse)
def obter_produto(produto_id: int, db: Session = Depends(get_db)):
    return ProdutoService(db).obter_produto(produto_id)


@router.post("/", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db)):
    return ProdutoService(db).criar_produto(dados)


@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(produto_id: int, dados: ProdutoUpdate, db: Session = Depends(get_db)):
    return ProdutoService(db).atualizar_produto(produto_id, dados)


@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    ProdutoService(db).deletar_produto(produto_id)
