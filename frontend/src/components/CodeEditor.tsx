import { langs } from "@uiw/codemirror-extensions-langs";
import { basicDark, basicLight } from "@uiw/codemirror-theme-basic";
import { duotoneDark, duotoneLight } from "@uiw/codemirror-theme-duotone";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { materialDark, materialLight } from "@uiw/codemirror-theme-material";
import { solarizedDark, solarizedLight } from "@uiw/codemirror-theme-solarized";
import { whiteDark, whiteLight } from "@uiw/codemirror-theme-white";
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode";
import CodeMirror, {
  BasicSetupOptions,
  Extension,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { useCallback, useContext, useEffect, useState } from "react";

import { CollaborationContext } from "../context/CollaborationContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { CodingTheme, QuestionContext } from "../context/QuestionContext";
import { useAuth } from "../context/AuthContext";

function CodeEditor() {
  const { initialCode, selectedLanguage, selectedTheme } =
    useContext(QuestionContext);
  const { socketCode, currentCode, changeCode, setCurrentCode } =
    useContext(CollaborationContext);
  const { currentUser } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  const [initializing, setInitializing] = useState<boolean>(true);
  const [_codeSubmitted, setCodeSubmitted] = useState<boolean>(false);
  const [extensions, setExtensions] = useState<Extension[]>();

  const onChange = useCallback(
    (value: string, _viewUpdate: ViewUpdate) => {
      setCurrentCode(value);
    },
    [setCurrentCode],
  );

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

  type themeValue = {
    light: Extension;
    dark: Extension;
  };

  const themes = new Map<CodingTheme, themeValue>();
  themes.set("basic", {
    light: basicLight,
    dark: basicDark,
  });
  themes.set("duotone", {
    light: duotoneLight,
    dark: duotoneDark,
  });
  themes.set("github", {
    light: githubLight,
    dark: githubDark,
  });
  themes.set("material", {
    light: materialLight,
    dark: materialDark,
  });
  themes.set("solarized", {
    light: solarizedLight,
    dark: solarizedDark,
  });
  themes.set("white", {
    light: whiteLight,
    dark: whiteDark,
  });
  themes.set("xcode", {
    light: xcodeLight,
    dark: xcodeDark,
  });

  return (
    <div className="h-144 border rounded-lg shadow">
      <CodeMirror
        value={currentCode}
        height="500px"
        extensions={extensions}
        onChange={onChange}
        theme={
          isDarkMode
            ? themes.get(selectedTheme)!.dark
            : themes.get(selectedTheme)!.light
        }
        basicSetup={codeMirrorOptions}
      />
    </div>
  );
}

export default CodeEditor;
