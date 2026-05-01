export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoria?: string;
  criado_em: string;
  atualizado_em?: string;
}

export interface ProdutoCreate {
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoria?: string;
}

export interface Venda {
  id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  total: number;
  cliente?: string;
  observacao?: string;
  criado_em: string;
  produto?: Produto;
}

export interface VendaCreate {
  produto_id: number;
  quantidade: number;
  cliente?: string;
  observacao?: string;
}

export interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  categoria?: string;
  data_despesa: string;
  criado_em: string;
}

export interface DespesaCreate {
  descricao: string;
  valor: number;
  categoria?: string;
  data_despesa?: string;
}

export interface Dashboard {
  faturamento_total: number;
  despesas_totais: number;
  saldo: number;
  total_vendas: number;
  produtos_cadastrados: number;
}
