import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import socket from "../util/socket";
import { MatchingContext } from "./MatchingContext";
import { CodingLanguage } from "./QuestionContext";
import { useAuth } from "./AuthContext";

interface CollaborationProviderProps {
  children: ReactNode;
}

interface CollaborationContextType {
  currentCode: string;
  socketCode: string;
  socketLanguage: CodingLanguage;
  setCurrentCode: (code: string) => void;
  changeCode: (code: string) => void;
  changeLanguage: (language: string) => void;
}

export const CollaborationContext = createContext<CollaborationContextType>({
  currentCode: "",
  socketCode: "",
  socketLanguage: "java",
  setCurrentCode: () => {},
  changeCode: () => {},
  changeLanguage: () => {},
});

export function CollaborationProvider({
  children,
}: CollaborationProviderProps) {
  const { currentUser } = useAuth();
  const { matchingId } = useContext(MatchingContext);

  const [connectionLoading, setConnectionLoading] = useState<boolean>(true);
  const [socketCode, setSocketCode] = useState<string>("");
  const [socketLanguage, setSocketLanguage] = useState<CodingLanguage>("java");
  const [currentCode, setCurrentCode] = useState<string>("");

  const emitSocketEvent = useCallback(
    (eventName: string, data: Record<string, any> = {}) => {
      if (!currentUser) return;
      console.log("Collaboration Context", eventName, {
        userId: currentUser.uid,
        ...data,
      });
      socket.emit(eventName, {
        userId: currentUser.uid,
        ...data,
      });
    },
    [currentUser],
  );

  const join = useCallback(() => {
    if (!currentUser) return;
    emitSocketEvent("join");
  }, [emitSocketEvent, currentUser]);

  const changeCode = useCallback(
    (code: string) => {
      console.log(
        "Collaboration Context",
        "Change Code Flag:",
        !currentUser || !matchingId,
      );
      if (!currentUser || !matchingId) return;
      emitSocketEvent("change-code", {
        requestId: matchingId,
        code,
      });
    },
    [emitSocketEvent, currentUser, matchingId],
  );

  const changeLanguage = useCallback(
    (language: string) => {
      if (!currentUser || !matchingId) return;
      emitSocketEvent("change-language", {
        requestId: matchingId,
        language,
      });
    },
    [emitSocketEvent, currentUser, matchingId],
  );

  const onCodeChanged = useCallback(
    (value: any) => {
      const valString = JSON.stringify(value);
      const obj = JSON.parse(valString);
      const { userId, requestId, code } = obj;
      if (!currentUser || !matchingId) return;
      if (userId === currentUser.uid || requestId !== matchingId) return;
      setSocketCode(code);
    },
    [currentUser, matchingId],
  );

  const onLanguageChanged = useCallback(
    (value: any) => {
      const valString = JSON.stringify(value);
      const obj = JSON.parse(valString);
      const { userId, requestId, language } = obj;
      if (!currentUser || !matchingId) return;
      if (userId === currentUser.uid || requestId !== matchingId) return;
      setSocketLanguage(language);
    },
    [currentUser, matchingId],
  );

  useEffect(() => {
    setConnectionLoading(true);
    socket.connect();

    if (currentUser) {
      join();
    }

    socket.on("code-changed", onCodeChanged);
    socket.on("language-changed", onLanguageChanged);

    return () => {
      socket.off("code-changed", onCodeChanged);
      socket.off("language-changed", onLanguageChanged);
      socket.disconnect();
    };
  }, [currentUser, join, onCodeChanged, onLanguageChanged]);

  const value = useMemo(
    () => ({
      currentCode,
      socketCode,
      socketLanguage,
      connectionLoading,
      setCurrentCode,
      changeCode,
      changeLanguage,
    }),
    [
      currentCode,
      socketCode,
      socketLanguage,
      connectionLoading,
      setCurrentCode,
      changeCode,
      changeLanguage,
    ],
  );

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}
