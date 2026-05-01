import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ColorFilter = "none" | "protanopia" | "deuteranopia" | "tritanopia";

interface AccessibilityContextType {
  colorFilter: ColorFilter;
  setColorFilter: (f: ColorFilter) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  colorFilter: "none",
  setColorFilter: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
});

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [colorFilter, setColorFilter] = useState<ColorFilter>(
    () => (localStorage.getItem("a11y-filter") as ColorFilter) ?? "none"
  );
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem("a11y-contrast") === "true"
  );

  useEffect(() => {
    localStorage.setItem("a11y-filter", colorFilter);
  }, [colorFilter]);

  useEffect(() => {
    localStorage.setItem("a11y-contrast", String(highContrast));
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast((v) => !v);

  return (
    <AccessibilityContext.Provider value={{ colorFilter, setColorFilter, highContrast, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
