from sqlalchemy import Column, Integer, Float, DateTime, String
from sqlalchemy.sql import func
from app.core.database import Base


class Despesa(Base):
    __tablename__ = "despesas"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(300), nullable=False)
    valor = Column(Float, nullable=False)
    categoria = Column(String(100), nullable=True)
    data_despesa = Column(DateTime(timezone=True), server_default=func.now())
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
