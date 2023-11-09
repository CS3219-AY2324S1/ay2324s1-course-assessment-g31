import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import { MatchingContext } from "../context/MatchingContext";
import QuestionLanguageContext from "../context/QuestionLanguageContext";

function CodingSpace() {
  const languageOptions = useMemo(() => ["javascript", "python"], []);

  const selectedLanguage = useContext(QuestionLanguageContext);
  const { matchedQuestionId, socketLanguage, changeLanguage } = useContext(MatchingContext);
  const [language, setLanguage] = useState(
    selectedLanguage || languageOptions[0],
  );
  const navigate = useNavigate();

  const handleLanguageChange = useCallback(
    (lang: string) => {
      navigate(`/questions/${matchedQuestionId}/?lang=${lang}`);
    },
    [navigate, matchedQuestionId],
  );

  useEffect(() => {
    setLanguage(selectedLanguage || languageOptions[0]);
    changeLanguage(selectedLanguage || languageOptions[0]);
  }, [selectedLanguage, changeLanguage, languageOptions]);

  useEffect(() => {
    if (socketLanguage === "") return;
    if (socketLanguage === language) return;
    handleLanguageChange(socketLanguage);
  }, [socketLanguage, language, handleLanguageChange]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
          Coding Space
        </h3>
        <div className="mb-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Language
            <select
              id="language"
              name="language"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-gray-100 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {languageOptions.map((lang) => (
                <option key={`lang-opt-${lang}`}>{lang}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <CodeEditor selectedLanguage={language} />
    </div>
  );
}

export default CodingSpace;
