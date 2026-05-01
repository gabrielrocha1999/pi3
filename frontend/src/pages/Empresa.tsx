import { useState } from "react";
import { consultarCnpj, type CnpjResult } from "../api/external";
import { Search, Loader2, Building2 } from "lucide-react";

const fmtCnpj = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const fmtMoeda = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function EmpresaPage() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CnpjResult | null>(null);

  const handleSearch = async () => {
    const limpo = cnpj.replace(/\D/g, "");
    if (limpo.length !== 14) {
      setError("CNPJ deve ter 14 dígitos.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await consultarCnpj(limpo);
      setResult(data);
    } catch {
      setError("CNPJ não encontrado ou serviço indisponível.");
    } finally {
      setLoading(false);
    }
  };

  const situacaoColor =
    result?.situacao_cadastral === "ATIVA"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-gray-500 mb-6">
        Consulte dados de uma empresa pelo CNPJ via BrasilAPI.
      </p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <label htmlFor="cnpj-input" className="block text-sm font-medium text-gray-700 mb-2">
          CNPJ
        </label>
        <div className="flex gap-2">
          <input
            id="cnpj-input"
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(fmtCnpj(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="00.000.000/0000-00"
            maxLength={18}
            aria-label="CNPJ da empresa para consulta"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            aria-label="Consultar CNPJ"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Consultar
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {result && (
        <div
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
          role="region"
          aria-label="Dados da empresa consultada"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-800">{result.razao_social}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${situacaoColor}`}>
                  {result.situacao_cadastral}
                </span>
              </div>
              {result.nome_fantasia && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Nome fantasia: <span className="font-medium text-gray-700">{result.nome_fantasia}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="CNPJ" value={fmtCnpj(result.cnpj)} />
            <InfoRow label="Porte" value={result.porte} />
            <InfoRow label="Natureza Jurídica" value={result.natureza_juridica} />
            <InfoRow label="Capital Social" value={fmtMoeda(result.capital_social)} />
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Endereço</p>
            <p className="text-gray-700">
              {result.logradouro}, {result.numero}
              {result.complemento ? ` — ${result.complemento}` : ""}
            </p>
            <p className="text-gray-500">
              {result.bairro} · {result.municipio}/{result.uf} · CEP {result.cep}
            </p>
          </div>

          {(result.email || result.telefone) && (
            <>
              <hr className="border-gray-100" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                {result.email && <InfoRow label="E-mail" value={result.email} />}
                {result.telefone && <InfoRow label="Telefone" value={result.telefone} />}
              </div>
            </>
          )}
        </div>
      )}

      {!result && !loading && !error && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Digite um CNPJ acima para consultar os dados da empresa.
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-gray-700 font-medium">{value || "—"}</p>
    </div>
  );
}
