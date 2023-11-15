import { useCallback, useContext, useEffect, useMemo } from "react";

import {
  CodingLanguage,
  CodingTheme,
  QuestionContext,
} from "../context/QuestionContext";
import CodeEditor from "./CodeEditor";
import { CollaborationContext } from "../context/CollaborationContext";

function CodingSpace() {
  const languageOptions: CodingLanguage[] = useMemo(() => ["java", "cpp"], []);
  const themeOptions: CodingTheme[] = useMemo(
    () => [
      "basic",
      "duotone",
      "github",
      "material",
      "solarized",
      "white",
      "xcode",
    ],
    [],
  );

  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedTheme,
    setSelectedTheme,
  } = useContext(QuestionContext);
  const { socketLanguage, changeLanguage } = useContext(CollaborationContext);

  const handleLanguageChange = useCallback(
    (newLanguage: CodingLanguage) => {
      setSelectedLanguage(newLanguage);
      changeLanguage(newLanguage);
    },
    [setSelectedLanguage, changeLanguage],
  );

  const handleThemeChange = useCallback(
    (newTheme: CodingTheme) => {
      setSelectedTheme(newTheme);
    },
    [setSelectedTheme],
  );

  useEffect(() => {
    setSelectedLanguage(socketLanguage as CodingLanguage);
  }, [socketLanguage, setSelectedLanguage]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
          Coding Space
        </h3>
        <div className="flex flex-row gap-4">
          <div className="mb-4">
            <label
              htmlFor="theme"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
              value={selectedTheme}
              onChange={(e) => handleThemeChange(e.target.value as CodingTheme)}
            >
              {themeOptions.map((theme) => (
                <option key={`theme-opt-${theme}`}>{theme}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
              value={selectedLanguage}
              onChange={(e) =>
                handleLanguageChange(e.target.value as CodingLanguage)
              }
            >
              {languageOptions.map((lang) => (
                <option key={`lang-opt-${lang}`}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <CodeEditor />
    </div>
  );
}

export default CodingSpace;
