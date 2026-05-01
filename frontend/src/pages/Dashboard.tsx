import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import type { Dashboard } from "../types";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { DollarSign, TrendingDown, ShoppingCart, Package, Wallet } from "lucide-react";

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function MetricCard({ title, value, icon: Icon, color, bg }: CardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError("Não foi possível carregar o dashboard. Verifique a conexão com o backend."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  const cards: CardProps[] = [
    {
      title: "Faturamento Total",
      value: fmt(data.faturamento_total),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Despesas Totais",
      value: fmt(data.despesas_totais),
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Saldo",
      value: fmt(data.saldo),
      icon: Wallet,
      color: data.saldo >= 0 ? "text-blue-600" : "text-red-600",
      bg: data.saldo >= 0 ? "bg-blue-50" : "bg-red-50",
    },
    {
      title: "Total de Vendas",
      value: String(data.total_vendas),
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Produtos Cadastrados",
      value: String(data.produtos_cadastrados),
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Visão geral do desempenho financeiro da empresa
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <MetricCard key={c.title} {...c} />
        ))}
      </div>
    </div>
  );
}
