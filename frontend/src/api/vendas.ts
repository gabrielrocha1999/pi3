import api from "./client";
import type { Venda, VendaCreate } from "../types";

export const getVendas = (): Promise<Venda[]> =>
  api.get("/vendas/").then((r) => r.data);

export const createVenda = (data: VendaCreate): Promise<Venda> =>
  api.post("/vendas/", data).then((r) => r.data);
