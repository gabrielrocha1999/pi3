import { useEffect, useState } from "react";
import { getProdutos, createProduto, updateProduto, deleteProduto } from "../api/produtos";
import type { Produto, ProdutoCreate } from "../types";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const emptyForm: ProdutoCreate = { nome: "", preco: 0, quantidade: 0, categoria: "", descricao: "" };

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState<ProdutoCreate>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getProdutos()
      .then(setProdutos)
      .catch(() => setError("Erro ao carregar produtos."))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Produto) => {
    setEditing(p);
    setForm({ nome: p.nome, preco: p.preco, quantidade: p.quantidade, categoria: p.categoria ?? "", descricao: p.descricao ?? "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateProduto(editing.id, form);
        setFeedback({ type: "success", msg: "Produto atualizado com sucesso!" });
      } else {
        await createProduto(form);
        setFeedback({ type: "success", msg: "Produto criado com sucesso!" });
      }
      setModalOpen(false);
      load();
    } catch {
      setFeedback({ type: "error", msg: "Erro ao salvar produto." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirma a exclusão deste produto?")) return;
    try {
      await deleteProduto(id);
      setFeedback({ type: "success", msg: "Produto excluído." });
      load();
    } catch {
      setFeedback({ type: "error", msg: "Erro ao excluir produto." });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{produtos.length} produto(s) cadastrado(s)</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Novo Produto
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
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Categoria</th>
              <th className="text-right px-4 py-3 font-medium">Preço</th>
              <th className="text-right px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {produtos.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-10">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.nome}</td>
                <td className="px-4 py-3 text-gray-500">{p.categoria || "—"}</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt(p.preco)}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      p.quantidade <= 5 ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {p.quantidade <= 5 && <AlertTriangle size={13} />}
                    {p.quantidade}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-600 mr-1"
                    aria-label="Editar"
                    title="Editar produto"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500"
                    aria-label="Excluir"
                    title="Excluir produto"
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
        <Modal title={editing ? "Editar Produto" : "Novo Produto"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.quantidade}
                  onChange={(e) => setForm({ ...form, quantidade: parseInt(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
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
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
