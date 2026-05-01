from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.venda_service import VendaService
from app.services.despesa_service import DespesaService
from app.services.produto_service import ProdutoService
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
def obter_dashboard(db: Session = Depends(get_db)):
    faturamento = VendaService(db).faturamento_total()
    despesas = DespesaService(db).total_despesas()
    total_vendas = VendaService(db).total_vendas()
    produtos = ProdutoService(db).contar_produtos()

    return DashboardResponse(
        faturamento_total=faturamento,
        despesas_totais=despesas,
        saldo=faturamento - despesas,
        total_vendas=total_vendas,
        produtos_cadastrados=produtos,
    )
