import React, { createContext } from "react";

interface CodeContextType {
  currentCode: string;
  setCurrentCode: React.Dispatch<React.SetStateAction<string>>;
}

const CodeContext = createContext<CodeContextType>({
  currentCode: "",
  setCurrentCode: () => {},
});

export default CodeContext;
