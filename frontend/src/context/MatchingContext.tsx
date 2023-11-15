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
  setMatchedUserId: React.Dispatch<React.SetStateAction<string>>;
  setMatchingId: React.Dispatch<React.SetStateAction<string>>;
  beginCollaboration: () => void;
  cancelCollaboration: () => void;
}

export const MatchingContext = createContext<MatchingContextType>({
  matchingId: "",
  matchedUserId: "",
  establishedConnection: false,
  foundMatch: false,
  connectionLoading: true,
  matchLoading: true,
  setMatchedUserId: () => {},
  setMatchingId: () => {},
  beginCollaboration: () => {},
  cancelCollaboration: () => {},
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

  const navigate = useNavigate();

  const emitSocketEvent = useCallback(
    (eventName: string, data: Record<string, any> = {}) => {
      if (!currentUser) return;
      console.log("Matching Context", eventName, {
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

  const cancelCollaboration = useCallback(() => {
    if (!matchingId) return;
    emitSocketEvent("cancel-collaboration", {
      requestId: matchingId,
    });
    setMatchedUserId("");
    setMatchingId("");
    setFoundMatch(false);
  }, [emitSocketEvent, matchingId]);

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

  const onMatchingCreated = useCallback(
    (value: any) => {
      if (!currentUser) return;
      const obj = JSON.parse(value);
      const { user1Id, user2Id, requestId } = obj;
      const newMatchedUserId = user1Id === currentUser.uid ? user2Id : user1Id;
      setMatchedUserId(() => newMatchedUserId);
      setMatchingId(() => requestId);
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
      setMatchedUserId("");
      setMatchingId("");
      setFoundMatch(false);
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
    socket.on("matching-created", onMatchingCreated);

    return () => {
      socket.off("joined", onJoined);
      socket.off("matching-created", onMatchingCreated);
      socket.disconnect();
    };
  }, [currentUser, join, onJoined, onMatchingCreated]);

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
      setMatchedUserId,
      setMatchingId,
      beginCollaboration,
      cancelCollaboration,
    }),
    [
      matchingId,
      matchedUserId,
      establishedConnection,
      foundMatch,
      connectionLoading,
      matchLoading,
      setMatchedUserId,
      setMatchingId,
      beginCollaboration,
      cancelCollaboration,
    ],
  );

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
}
