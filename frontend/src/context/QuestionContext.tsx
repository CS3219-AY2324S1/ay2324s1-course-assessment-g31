import { langs } from "@uiw/codemirror-extensions-langs";
import { createContext, ReactNode, useMemo, useState } from "react";

export type CodingLanguage = keyof typeof langs;

const defaultSelectedLanguage = "java" as CodingLanguage;

enum themeKeys {
  "basic",
  "duotone",
  "github",
  "material",
  "solarized",
  "white",
  "xcode",
}

export type CodingTheme = keyof typeof themeKeys;

const defaultSelectedTheme = "basic";

interface QuestionProviderProps {
  children: ReactNode;
}

interface QuestionContextType {
  selectedLanguage: CodingLanguage;
  selectedTheme: CodingTheme;
  setSelectedLanguage: (selectedLanguage: CodingLanguage) => void;
  setSelectedTheme: (selectedTheme: CodingTheme) => void;
}

export const QuestionContext = createContext<QuestionContextType>({
  selectedLanguage: defaultSelectedLanguage,
  selectedTheme: defaultSelectedTheme,
  setSelectedLanguage: (_selectedLanguage: CodingLanguage) => {},
  setSelectedTheme: (_selectedTheme: CodingTheme) => {},
});

export function QuestionProvider({ children }: QuestionProviderProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<CodingLanguage>(
    defaultSelectedLanguage,
  );
  const [selectedTheme, setSelectedTheme] =
    useState<CodingTheme>(defaultSelectedTheme);

  const value = useMemo(
    () => ({
      selectedLanguage,
      selectedTheme,
      setSelectedLanguage,
      setSelectedTheme,
    }),
    [selectedLanguage, selectedTheme, setSelectedLanguage, setSelectedTheme],
  );

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}
