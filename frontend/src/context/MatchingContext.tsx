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
  establishedConnection: boolean;
  foundMatch: boolean;
  connectionLoading: boolean;
  matchLoading: boolean;
  matchedQuestionId: number;
  setMatchedUserId: React.Dispatch<React.SetStateAction<string>>;
  setMatchingId: React.Dispatch<React.SetStateAction<string>>;
  beginCollaboration: () => void;
  cancelCollaboration: (code: string, language: string) => void;
  resetMatch: () => void;
}

export const MatchingContext = createContext<MatchingContextType>({
  matchingId: "",
  matchedUserId: "",
  establishedConnection: false,
  foundMatch: false,
  connectionLoading: true,
  matchLoading: true,
  matchedQuestionId: 0,
  setMatchedUserId: () => {},
  setMatchingId: () => {},
  beginCollaboration: () => {},
  cancelCollaboration: (_code: string, _language: string) => {},
  resetMatch: () => {},
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

  const [matchedQuestionId, setMatchedQuestionId] = useState<number>(0);

  const navigate = useNavigate();

  const resetMatch = useCallback(() => {
    setMatchedUserId("");
    setMatchingId("");
    setFoundMatch(false);
    setMatchLoading(true);
  }, []);

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
      if (!matchingId || !currentUser) return;
      type cancelCollaborationData = {
        requestId: string;
        questionId: string;
        userId: string;
        matchedUserId: string;
        code: string;
        language: string;
      };
      const data: cancelCollaborationData = {
        requestId: matchingId,
        questionId: matchedQuestionId.toString(),
        userId: currentUser.uid,
        matchedUserId,
        code,
        language,
      };
      emitSocketEvent("cancel-collaboration", data);
      resetMatch();
    },
    [
      emitSocketEvent,
      resetMatch,
      currentUser,
      matchingId,
      matchedUserId,
      matchedQuestionId,
    ],
  );

  const beginCollaboration = useCallback(() => {
    if (!currentUser) return;
    emitSocketEvent("begin-collaboration", {
      requestId: matchingId,
    });
  }, [emitSocketEvent, currentUser, matchingId]);

  const onJoined = useCallback(() => {
    setEstablishedConnection(true);
    setConnectionLoading(false);
    setMatchLoading(true);
  }, []);

  const onMatchingFulfilled = useCallback(
    (value: any) => {
      if (!currentUser) return;
      const obj = JSON.parse(value);
      const { id : matchingIdFromSocket, user1Id, user2Id, questionIdRequested: questionId } = obj;

      const newMatchedUserId = user1Id === currentUser.uid ? user2Id : user1Id;
      setMatchedUserId(() => newMatchedUserId);
      setMatchingId(() => matchingIdFromSocket);
      setMatchedQuestionId(questionId);
      setMatchLoading(false);
      setFoundMatch(true);
    },
    [currentUser],
  );

  const onCollaborationCancelled = useCallback(
    (value: any) => {
      const valString = JSON.stringify(value);
      const obj = JSON.parse(valString);
      const { userId, requestId } = obj;
      if (!currentUser || !matchingId) return;
      if (userId === currentUser.uid || requestId !== matchingId) return;
      resetMatch();
      navigate("/match");
    },
    [currentUser, matchingId, navigate, resetMatch],
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

    socket.on("collaboration-cancelled", onCollaborationCancelled);

    return () => {
      socket.off("collaboration-cancelled", onCollaborationCancelled);
      socket.disconnect();
    };
  }, [currentUser, matchedUserId, matchingId, join, onCollaborationCancelled]);

  const value = useMemo(
    () => ({
      matchingId,
      matchedUserId,
      establishedConnection,
      foundMatch,
      connectionLoading,
      matchLoading,
      matchedQuestionId,
      setMatchedUserId,
      setMatchingId,
      beginCollaboration,
      cancelCollaboration,
      resetMatch,
    }),
    [
      matchingId,
      matchedUserId,
      establishedConnection,
      foundMatch,
      connectionLoading,
      matchLoading,
      matchedQuestionId,
      setMatchedUserId,
      setMatchingId,
      beginCollaboration,
      cancelCollaboration,
      resetMatch,
    ],
  );

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
}
