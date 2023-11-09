import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import socket from "../util/socket";
import { useAuth } from "./AuthContext";

interface MatchingProviderProps {
  children: ReactNode;
}

interface MatchingContextType {
  matchingId: string;
  matchedUserId: string;
  socketCode: string;
  socketLanguage: string;
  establishedConnection: boolean;
  foundMatch: boolean;
  connectionLoading: boolean;
  matchLoading: boolean;
  matchedQuestionId: number;
  setMatchedUserId: React.Dispatch<React.SetStateAction<string>>;
  setMatchingId: React.Dispatch<React.SetStateAction<string>>;
  beginCollaboration: () => void;
  cancelCollaboration: (code: string, language: string) => void;
  changeCode: (code: string) => void;
  changeLanguage: (language: string) => void;
}

export const MatchingContext = createContext<MatchingContextType>({
  matchingId: "",
  matchedUserId: "",
  socketCode: "",
  socketLanguage: "",
  establishedConnection: false,
  foundMatch: false,
  connectionLoading: true,
  matchLoading: true,
  matchedQuestionId: 0,
  setMatchedUserId: () => {},
  setMatchingId: () => {},
  beginCollaboration: () => {},
  cancelCollaboration: () => {},
  changeCode: () => {},
  changeLanguage: () => {},
});

export function MatchingProvider({ children }: MatchingProviderProps) {
  const { currentUser } = useAuth();

  const [establishedConnection, setEstablishedConnection] =
    useState<boolean>(false);
  const [foundMatch, setFoundMatch] = useState<boolean>(false);

  const [connectionLoading, setConnectionLoading] = useState<boolean>(true);
  const [matchLoading, setMatchLoading] = useState<boolean>(true);

  const [matchedUserId, setMatchedUserId] = useState<string>("");
  const [matchingId, setMatchingId] = useState<string>("");

  const [socketCode, setSocketCode] = useState<string>("");
  const [socketLanguage, setSocketLanguage] = useState<string>("");

  const [matchedQuestionId, setMatchedQuestionId] = useState<number>(0);

  const navigate = useNavigate();

  const emitSocketEvent = useCallback(
    (eventName: string, data: Record<string, any> = {}) => {
      if (!currentUser) return;
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

  const cancelCollaboration = useCallback(
    (code: string, language: string) => {
      if (!matchingId) return;
      emitSocketEvent("cancel-collaboration", {
        requestId: matchingId,
        matchedUserId,
        // placeholder
        questionId: matchedQuestionId,
        // add collaboration details
        code,
        language,
      });
      setMatchedUserId("");
      setMatchingId("");
    },
    [emitSocketEvent, matchingId, matchedUserId],
  );

  const beginCollaboration = useCallback(() => {
    if (!currentUser) return;
    emitSocketEvent("begin-collaboration", {
      requestId: matchingId,
    });
  }, [emitSocketEvent, currentUser, matchingId]);

  const changeCode = useCallback(
    (code: string) => {
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

  const onJoined = useCallback(() => {
    setEstablishedConnection(true);
    setConnectionLoading(false);
    setMatchLoading(true);
  }, []);

  const onMatchingFulfilled = useCallback(
    (value: any) => {
      if (!currentUser) return;
      const obj = JSON.parse(value);
      const { matchingId,
        user1Id,
        user2Id,
        questionId, } = obj;

      const newMatchedUserId = user1Id === currentUser.uid ? user2Id : user1Id;
      setMatchedUserId(() => newMatchedUserId);
      setMatchingId(() => matchingId);
      setMatchedQuestionId(questionId);
      setMatchLoading(false);
      setFoundMatch(true);
    },
    [currentUser],
  );

  const onCodeChanged = useCallback(
    (value: any) => {
      const valString = JSON.stringify(value);
      const obj = JSON.parse(valString);
      const { userId, requestId, code } = obj;
      if (userId === currentUser!.uid || requestId !== matchingId) return;
      setSocketCode(code);
    },
    [currentUser, matchingId],
  );

  const onLanguageChanged = useCallback(
    (value: any) => {
      const valString = JSON.stringify(value);
      const obj = JSON.parse(valString);
      const { userId, requestId, language } = obj;
      if (userId === currentUser!.uid || requestId !== matchingId) return;
      setSocketLanguage(language);
    },
    [currentUser, matchingId],
  );

  const onCollaborationCancelled = useCallback(
    (value: any) => {
      const valString = JSON.stringify(value);
      const obj = JSON.parse(valString);
      const { userId, requestId } = obj;
      if (userId === currentUser!.uid || requestId !== matchingId) return;
      setMatchedUserId("");
      setMatchingId("");
      navigate("/match");
    },
    [currentUser, matchingId, navigate],
  );

  useEffect(() => {
    setConnectionLoading(true);
    socket.connect();

    if (currentUser) {
      join();
    }

    socket.on("joined", onJoined);
    socket.on("matching-fulfilled", onMatchingFulfilled);

    return () => {
      socket.off("joined", onJoined);
      socket.off("matching-fulfilled", onMatchingFulfilled);
      socket.disconnect();
    };
  }, [currentUser, join, onJoined, onMatchingFulfilled]);

  useEffect(() => {
    setConnectionLoading(true);
    socket.connect();

    if (currentUser) {
      join();
    }

    socket.on("code-changed", onCodeChanged);
    socket.on("language-changed", onLanguageChanged);
    socket.on("collaboration-cancelled", onCollaborationCancelled);

    return () => {
      socket.off("code-changed", onCodeChanged);
      socket.off("language-changed", onLanguageChanged);
      socket.off("collaboration-cancelled", onCollaborationCancelled);
      socket.disconnect();
    };
  }, [
    currentUser,
    matchedUserId,
    matchingId,
    join,
    onCodeChanged,
    onLanguageChanged,
    onCollaborationCancelled,
  ]);

  const value = useMemo(() => {
    return {
      matchingId,
      matchedUserId,
      socketCode,
      socketLanguage,
      establishedConnection,
      foundMatch,
      connectionLoading,
      matchLoading,
      matchedQuestionId,
      setMatchedUserId,
      setMatchingId,
      beginCollaboration,
      cancelCollaboration,
      changeCode,
      changeLanguage,
    };
  }, [
    beginCollaboration,
    cancelCollaboration,
    changeCode,
    changeLanguage,
    connectionLoading,
    establishedConnection,
    foundMatch,
    matchLoading,
    matchedUserId,
    matchingId,
    setMatchedUserId,
    setMatchingId,
    socketCode,
    socketLanguage,
    matchedQuestionId
  ]);

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
}
