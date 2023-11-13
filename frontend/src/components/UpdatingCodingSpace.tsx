import { useCallback, useContext, useMemo } from "react";

import { CodingLanguage, QuestionContext } from "../context/QuestionContext";
import ComponentContainer from "./container/Component";
import CodeEditorEditor from "./UpdatingCodeEditor";

function UpdatingCodingSpace() {
  const languageOptions: CodingLanguage[] = useMemo(() => ["java", "cpp"], []);

  const { selectedLanguage, setSelectedLanguage } = useContext(QuestionContext);

  const handleLanguageChange = useCallback(
    (newLanguage: CodingLanguage) => {
      setSelectedLanguage(newLanguage);
    },
    [setSelectedLanguage],
  );

  return (
    <ComponentContainer>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
          Coding Space
        </h3>
        <div className="flex flex-row-reverse mb-4 gap-5">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
              value={selectedLanguage}
              onChange={(e) =>
                handleLanguageChange(e.target.value as CodingLanguage)
              }
            >
              {languageOptions.map((lang, _index) => (
                <option key={`lang-opt-${lang}`}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <CodeEditorEditor />
    </ComponentContainer>
  );
}

export default UpdatingCodingSpace;
