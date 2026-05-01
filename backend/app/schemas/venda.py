from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.produto import ProdutoResponse


class VendaBase(BaseModel):
    produto_id: int
    quantidade: int = Field(..., gt=0)
    cliente: Optional[str] = None
    observacao: Optional[str] = None


class VendaCreate(VendaBase):
    pass


class VendaResponse(VendaBase):
    id: int
    preco_unitario: float
    total: float
    criado_em: datetime
    produto: Optional[ProdutoResponse] = None

    model_config = {"from_attributes": True}
