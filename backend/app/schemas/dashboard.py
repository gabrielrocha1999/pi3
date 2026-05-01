from pydantic import BaseModel


class DashboardResponse(BaseModel):
    faturamento_total: float
    despesas_totais: float
    saldo: float
    total_vendas: int
    produtos_cadastrados: int
