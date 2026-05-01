from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProdutoBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=200)
    descricao: Optional[str] = None
    preco: float = Field(..., gt=0)
    quantidade: int = Field(..., ge=0)
    categoria: Optional[str] = None


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=200)
    descricao: Optional[str] = None
    preco: Optional[float] = Field(None, gt=0)
    quantidade: Optional[int] = Field(None, ge=0)
    categoria: Optional[str] = None


class ProdutoResponse(ProdutoBase):
    id: int
    criado_em: datetime
    atualizado_em: Optional[datetime] = None

    model_config = {"from_attributes": True}
