import { useEffect, useState } from "react";
import { getVendas, createVenda } from "../api/vendas";
import { getProdutos } from "../api/produtos";
import type { Venda, VendaCreate, Produto } from "../types";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import { Plus } from "lucide-react";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<VendaCreate>({ produto_id: 0, quantidade: 1, cliente: "", observacao: "" });
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([getVendas(), getProdutos()])
      .then(([v, p]) => { setVendas(v); setProdutos(p); })
      .catch(() => setError("Erro ao carregar vendas."))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createVenda(form);
      setFeedback({ type: "success", msg: "Venda registrada com sucesso!" });
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setFeedback({ type: "error", msg: detail || "Erro ao registrar venda." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{vendas.length} venda(s) registrada(s)</p>
        <button
          onClick={() => { setForm({ produto_id: produtos[0]?.id ?? 0, quantidade: 1 }); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Nova Venda
        </button>
      </div>

      {feedback && (
        <div className="mb-4">
          <Alert type={feedback.type} message={feedback.msg} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Data</th>
              <th className="text-left px-4 py-3 font-medium">Produto</th>
              <th className="text-left px-4 py-3 font-medium">Cliente</th>
              <th className="text-right px-4 py-3 font-medium">Qtd</th>
              <th className="text-right px-4 py-3 font-medium">Unit.</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vendas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-10">
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            )}
            {vendas.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{fmtDate(v.criado_em)}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{v.produto?.nome ?? `#${v.produto_id}`}</td>
                <td className="px-4 py-3 text-gray-500">{v.cliente || "—"}</td>
                <td className="px-4 py-3 text-right text-gray-700">{v.quantidade}</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt(v.preco_unitario)}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-700">{fmt(v.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title="Registrar Venda" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
              <select
                required
                value={form.produto_id}
                onChange={(e) => setForm({ ...form, produto_id: parseInt(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0} disabled>Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — Estoque: {p.quantidade} — {fmt(p.preco)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
              <input
                required
                type="number"
                min="1"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: parseInt(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                value={form.cliente ?? ""}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
              <textarea
                value={form.observacao ?? ""}
                onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Registrar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
