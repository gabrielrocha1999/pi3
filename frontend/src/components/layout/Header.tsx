import { Eye } from "lucide-react";
import { useAccessibility, type ColorFilter } from "../../context/AccessibilityContext";

const filters: { value: ColorFilter; label: string }[] = [
  { value: "none", label: "Normal" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
];

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { colorFilter, setColorFilter } = useAccessibility();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-2">
        <Eye size={16} className="text-gray-500" />
        <label htmlFor="color-filter" className="text-xs text-gray-500 sr-only">
          Filtro de daltonismo
        </label>
        <select
          id="color-filter"
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value as ColorFilter)}
          className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Modo de acessibilidade para daltonismo"
          title="Filtro de acessibilidade para daltonismo"
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
