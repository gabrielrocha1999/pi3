import api from "./client";
import type { Dashboard } from "../types";

export const getDashboard = (): Promise<Dashboard> =>
  api.get("/dashboard/").then((r) => r.data);
