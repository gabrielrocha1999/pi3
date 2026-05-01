import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { consultarCep, type CepResult } from "../../api/external";

interface CepSearchProps {
  onResult: (result: CepResult) => void;
}

export default function CepSearch({ onResult }: CepSearchProps) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) {
      setError("CEP deve ter 8 dígitos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await consultarCep(limpo);
      onResult(result);
    } catch {
      setError("CEP não encontrado ou serviço indisponível.");
    } finally {
      setLoading(false);
    }
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Buscar CEP do cliente
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="00000-000"
          maxLength={9}
          aria-label="CEP para consulta"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          aria-label="Buscar endereço pelo CEP"
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Buscar
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
