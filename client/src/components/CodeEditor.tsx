import { langs } from "@uiw/codemirror-extensions-langs";
import { duotoneDark, duotoneLight } from "@uiw/codemirror-theme-duotone";
import CodeMirror, {
  BasicSetupOptions,
  Extension,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { useCallback, useContext, useEffect, useState } from "react";

import { CollaborationContext } from "../context/CollaborationContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { AuthContext } from "../context/FirebaseAuthContext";
import { QuestionContext } from "../context/QuestionContext";

function CodeEditor() {
  const { initialCode, selectedLanguage } = useContext(QuestionContext);
  const { socketCode, currentCode, changeCode, setCurrentCode } =
    useContext(CollaborationContext);
  const { currentUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [initializing, setInitializing] = useState<boolean>(true);
  const [_codeSubmitted, setCodeSubmitted] = useState<boolean>(false);
  const [codeResult, setCodeResult] = useState<string>("");
  const [extensions, setExtensions] = useState<Extension[]>();

  const onChange = useCallback(
    (value: string, _viewUpdate: ViewUpdate) => {
      setCurrentCode(value);
    },
    [setCurrentCode],
  );

  const handleSubmit = () => {
    setCodeResult("hello world!");
    setCodeSubmitted(true);
  };

  useEffect(() => {
    if (langs[selectedLanguage]) {
      setExtensions([langs[selectedLanguage]()]);
    } else {
      setExtensions([]);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (!currentUser) return;
    if (socketCode === "") return;
    setCurrentCode(socketCode);
  }, [socketCode, currentUser, initialCode, setCurrentCode]);

  useEffect(() => {
    if (!currentUser) return;
    if (initializing) return;
    changeCode(currentCode);
  }, [currentCode, changeCode, currentUser, initialCode, initializing]);

  useEffect(() => {
    setCurrentCode(initialCode);
    setInitializing(false);
  }, [initialCode, setCurrentCode]);

  const codeMirrorOptions: BasicSetupOptions = {
    indentOnInput: true,
  };

  const themes = new Map();
  themes.set('duotone', {
    light: duotoneLight,
    dark: duotoneDark,
  })

  return (
    <div className="h-144 border rounded-lg shadow">
      <CodeMirror
        value={currentCode}
        height="576px"
        extensions={extensions}
        onChange={onChange}
        theme={
          isDarkMode ? themes.get('duotone').dark : themes.get('duotone').light
        }
        basicSetup={codeMirrorOptions}
      />
    </div>
  );
}

export default CodeEditor;
