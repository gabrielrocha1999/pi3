import api from "./client";
import type { Despesa, DespesaCreate } from "../types";

export const getDespesas = (): Promise<Despesa[]> =>
  api.get("/despesas/").then((r) => r.data);

export const createDespesa = (data: DespesaCreate): Promise<Despesa> =>
  api.post("/despesas/", data).then((r) => r.data);

export const updateDespesa = (id: number, data: Partial<DespesaCreate>): Promise<Despesa> =>
  api.put(`/despesas/${id}`, data).then((r) => r.data);

export const deleteDespesa = (id: number): Promise<void> =>
  api.delete(`/despesas/${id}`);
