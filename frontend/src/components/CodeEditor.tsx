import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { useCallback, useContext, useEffect, useState } from "react";

import { MatchingContext } from "../context/MatchingContext";
import CodeResult from "./CodeResult";
import { useAuth } from "../context/AuthContext";

interface ICodeEditorProps {
  selectedLanguage: string;
}

function CodeEditor({ selectedLanguage }: ICodeEditorProps) {
  const [currentCode, setCurrentCode] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState<boolean>(false);
  const [codeResult, setCodeResult] = useState<string>("");
  const [extensions, setExtensions] = useState<Extension[]>();
  const { socketCode, changeCode } = useContext(MatchingContext);
  const { currentUser } = useAuth();

  const onChange = useCallback((value: string) => {
    setCurrentCode(value);
  }, []);

  const handleSubmit = () => {
    setCodeResult("hello world!");
    setCodeSubmitted(true);
  };

  useEffect(() => {
    const lang = selectedLanguage.toLowerCase() as keyof typeof langs;
    if (langs[lang]) {
      setExtensions([langs[lang]()]);
    } else {
      setExtensions([]);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (!currentUser) return;
    if (socketCode === "") return;
    if (socketCode === currentCode) return;
    setCurrentCode(socketCode);
  }, [socketCode, currentUser, currentCode]);

  useEffect(() => {
    if (!currentUser) return;
    changeCode(currentCode);
  }, [currentCode, changeCode, currentUser]);

  return (
    <div>
      <div className="h-144 border rounded-lg shadow">
        <CodeMirror
          value={currentCode}
          height="576px"
          extensions={extensions}
          onChange={onChange}
        />
      </div>
      <div className="flex flex-row-reverse mt-5">
        {codeSubmitted ? (
          <p>Code Submitted</p>
        ) : (
          <button
            type="button"
            className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
            onClick={handleSubmit}
          >
            Submit Code
          </button>
        )}
      </div>
      <div className="mt-5">
        <CodeResult result={codeResult} />
      </div>
    </div>
  );
}

export default CodeEditor;
