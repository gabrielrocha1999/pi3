import { createContext, useContext, useState, type ReactNode } from "react";

export type ColorFilter = "none" | "protanopia" | "deuteranopia" | "tritanopia";

interface AccessibilityContextType {
  colorFilter: ColorFilter;
  setColorFilter: (f: ColorFilter) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  colorFilter: "none",
  setColorFilter: () => {},
});

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [colorFilter, setColorFilter] = useState<ColorFilter>("none");
  return (
    <AccessibilityContext.Provider value={{ colorFilter, setColorFilter }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
