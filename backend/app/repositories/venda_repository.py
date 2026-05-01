from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from app.models.venda import Venda
from app.schemas.venda import VendaCreate


class VendaRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self, skip: int = 0, limit: int = 100) -> list[Venda]:
        return (
            self.db.query(Venda)
            .options(joinedload(Venda.produto))
            .order_by(Venda.criado_em.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def buscar_por_id(self, venda_id: int) -> Optional[Venda]:
        return (
            self.db.query(Venda)
            .options(joinedload(Venda.produto))
            .filter(Venda.id == venda_id)
            .first()
        )

    def criar(self, produto_id: int, quantidade: int, preco_unitario: float, cliente: Optional[str], observacao: Optional[str]) -> Venda:
        total = quantidade * preco_unitario
        venda = Venda(
            produto_id=produto_id,
            quantidade=quantidade,
            preco_unitario=preco_unitario,
            total=total,
            cliente=cliente,
            observacao=observacao,
        )
        self.db.add(venda)
        self.db.commit()
        self.db.refresh(venda)
        return venda

    def faturamento_total(self) -> float:
        resultado = self.db.query(func.sum(Venda.total)).scalar()
        return resultado or 0.0

    def total_vendas(self) -> int:
        return self.db.query(func.count(Venda.id)).scalar()
