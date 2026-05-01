import api from "./client";
import type { Produto, ProdutoCreate } from "../types";

export const getProdutos = (): Promise<Produto[]> =>
  api.get("/produtos/").then((r) => r.data);

export const getProduto = (id: number): Promise<Produto> =>
  api.get(`/produtos/${id}`).then((r) => r.data);

export const createProduto = (data: ProdutoCreate): Promise<Produto> =>
  api.post("/produtos/", data).then((r) => r.data);

export const updateProduto = (id: number, data: Partial<ProdutoCreate>): Promise<Produto> =>
  api.put(`/produtos/${id}`, data).then((r) => r.data);

export const deleteProduto = (id: number): Promise<void> =>
  api.delete(`/produtos/${id}`);
