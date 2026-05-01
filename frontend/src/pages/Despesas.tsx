import { useEffect, useState } from "react";
import { getDespesas, createDespesa, updateDespesa, deleteDespesa } from "../api/despesas";
import type { Despesa, DespesaCreate } from "../types";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import { Plus, Pencil, Trash2 } from "lucide-react";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("pt-BR");

const emptyForm: DespesaCreate = { descricao: "", valor: 0, categoria: "" };

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Despesa | null>(null);
  const [form, setForm] = useState<DespesaCreate>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getDespesas()
      .then(setDespesas)
      .catch(() => setError("Erro ao carregar despesas."))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d: Despesa) => {
    setEditing(d);
    setForm({ descricao: d.descricao, valor: d.valor, categoria: d.categoria ?? "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateDespesa(editing.id, form);
        setFeedback({ type: "success", msg: "Despesa atualizada!" });
      } else {
        await createDespesa(form);
        setFeedback({ type: "success", msg: "Despesa cadastrada!" });
      }
      setModalOpen(false);
      load();
    } catch {
      setFeedback({ type: "error", msg: "Erro ao salvar despesa." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirma a exclusão desta despesa?")) return;
    try {
      await deleteDespesa(id);
      setFeedback({ type: "success", msg: "Despesa excluída." });
      load();
    } catch {
      setFeedback({ type: "error", msg: "Erro ao excluir." });
    }
  };

  const total = despesas.reduce((s, d) => s + d.valor, 0);

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">{despesas.length} despesa(s)</p>
          <p className="text-sm font-semibold text-red-600">Total: {fmt(total)}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Nova Despesa
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
              <th className="text-left px-4 py-3 font-medium">Descrição</th>
              <th className="text-left px-4 py-3 font-medium">Categoria</th>
              <th className="text-right px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {despesas.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-10">
                  Nenhuma despesa cadastrada ainda.
                </td>
              </tr>
            )}
            {despesas.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{fmtDate(d.data_despesa)}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{d.descricao}</td>
                <td className="px-4 py-3 text-gray-500">{d.categoria || "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">{fmt(d.valor)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(d)}
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-600 mr-1"
                    aria-label="Editar despesa"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500"
                    aria-label="Excluir despesa"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Editar Despesa" : "Nova Despesa"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <input
                required
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: parseFloat(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  value={form.categoria ?? ""}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
