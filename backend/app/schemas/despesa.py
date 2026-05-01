from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DespesaBase(BaseModel):
    descricao: str = Field(..., min_length=1, max_length=300)
    valor: float = Field(..., gt=0)
    categoria: Optional[str] = None
    data_despesa: Optional[datetime] = None


class DespesaCreate(DespesaBase):
    pass


class DespesaUpdate(BaseModel):
    descricao: Optional[str] = Field(None, min_length=1, max_length=300)
    valor: Optional[float] = Field(None, gt=0)
    categoria: Optional[str] = None


class DespesaResponse(DespesaBase):
    id: int
    criado_em: datetime

    model_config = {"from_attributes": True}
