import { Eye, Contrast } from "lucide-react";
import { useAccessibility, type ColorFilter } from "../../context/AccessibilityContext";

const filters: { value: ColorFilter; label: string }[] = [
  { value: "none", label: "Padrão" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
];

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { colorFilter, setColorFilter, highContrast, toggleHighContrast } = useAccessibility();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-3" role="toolbar" aria-label="Opções de acessibilidade">
        {/* Alto contraste */}
        <button
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
          title="Alternar alto contraste"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            highContrast
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Contrast size={14} />
          Contraste
        </button>

        {/* Filtro de daltonismo */}
        <div className="flex items-center gap-1.5">
          <Eye size={14} className="text-gray-400" aria-hidden="true" />
          <select
            id="color-filter"
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value as ColorFilter)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filtro de acessibilidade para daltonismo"
            title="Modo de visão"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}