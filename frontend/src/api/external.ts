import api from "./client";

export interface CepResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface CnpjResult {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  descricao_situacao_cadastral: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  email: string;
  telefone: string;
  porte: string;
  natureza_juridica: string;
  capital_social: number;
}

export const consultarCep = (cep: string): Promise<CepResult> =>
  api.get(`/external/cep/${cep}`).then((r) => r.data);

export const consultarCnpj = (cnpj: string): Promise<CnpjResult> =>
  api.get(`/external/cnpj/${cnpj}`).then((r) => r.data);
