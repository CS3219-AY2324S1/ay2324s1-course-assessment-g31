import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { socket } from "../util/socket";
import { useAuth } from "./AuthContext";

interface Props {
  children?: ReactNode;
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
  setMatchedUserId: React.Dispatch<React.SetStateAction<string>>;
  setMatchingId: React.Dispatch<React.SetStateAction<string>>;
  beginCollaboration: () => void;
  cancelCollaboration: () => void;
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
  setMatchedUserId: () => {},
  setMatchingId: () => {},
  beginCollaboration: () => {},
  cancelCollaboration: () => {},
  changeCode: () => {},
  changeLanguage: () => {},
});

export const MatchingProvider = ({ children }: Props) => {
  const events = new Map<string, string>([
    ["join", "joined"],
    ["begin-collaboration", "collaboration-begun"],
    ["change-code", "code-changed"],
    ["cancel-collaboration", "collaboration-cancelled"],
  ]);

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

  const navigate = useNavigate();

  const emitSocketEvent = (
    eventName: string,
    data: Record<string, any> = {},
  ) => {
    if (!currentUser) return;
    socket.emit(eventName, {
      userId: currentUser.uid,
      ...data,
    });
  };

  const join = () => {
    if (!currentUser) return;
    emitSocketEvent("join");
  };

  const cancelCollaboration = () => {
    if (!matchingId) return;
    emitSocketEvent("cancel-collaboration", {
      requestId: matchingId,
    });
    setMatchedUserId("");
    setMatchingId("");
  };

  const beginCollaboration = () => {
    if (!currentUser) return;
    emitSocketEvent("begin-collaboration", {
      requestId: matchingId,
    });
  };

  const changeCode = (code: string) => {
    if (!currentUser || !matchingId) return;
    emitSocketEvent("change-code", {
      requestId: matchingId,
      code,
    });
  };

  const changeLanguage = (language: string) => {
    if (!currentUser || !matchingId) return;
    emitSocketEvent("change-language", {
      requestId: matchingId,
      language,
    });
  };

  const onJoined = (message: string) => {
    setEstablishedConnection(true);
    setConnectionLoading(false);
    setMatchLoading(true);
  };

  const onDisconnect = () => {
    console.log("Disconnected");
  };

  const onMatchingCreated = (value: any) => {
    if (!currentUser) return;
    const obj = JSON.parse(value);
    const { user1Id, user2Id, requestId } = obj;
    const newMatchedUserId = user1Id == currentUser.uid ? user2Id : user1Id;
    setMatchedUserId((prev) => newMatchedUserId);
    setMatchingId((prev) => requestId);
    setMatchLoading(false);
    setFoundMatch(true);
  };

  const onCodeChanged = (value: any) => {
    const valString = JSON.stringify(value);
    const obj = JSON.parse(valString);
    const { userId, requestId, code } = obj;
    if (userId == currentUser!.uid || requestId != matchingId) return;
    setSocketCode(code);
  };

  const onLanguageChanged = (value: any) => {
    const valString = JSON.stringify(value);
    const obj = JSON.parse(valString);
    const { userId, requestId, language } = obj;
    if (userId == currentUser!.uid || requestId != matchingId) return;
    setSocketLanguage(language);
  };

  const onCollaborationCancelled = (value: any) => {
    const valString = JSON.stringify(value);
    const obj = JSON.parse(valString);
    const { userId, requestId } = obj;
    if (userId == currentUser!.uid || requestId != matchingId) return;
    setMatchedUserId("");
    setMatchingId("");
    navigate("/match");
  };

  useEffect(() => {
    setConnectionLoading(true);
    socket.connect();

    if (currentUser) {
      join();
    }

    socket.on("joined", onJoined);
    socket.on("disconnect", onDisconnect);
    socket.on("matching-created", onMatchingCreated);

    return () => {
      socket.off("joined", onJoined);
      socket.off("disconnect", onDisconnect);
      socket.off("matching-created", onMatchingCreated);
      socket.disconnect();
    };
  }, [currentUser]);

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
  }, [currentUser, matchedUserId, matchingId]);

  const value = {
    matchingId,
    matchedUserId,
    socketCode,
    socketLanguage,
    establishedConnection,
    foundMatch,
    connectionLoading,
    matchLoading,
    setMatchedUserId,
    setMatchingId,
    beginCollaboration,
    cancelCollaboration,
    changeCode,
    changeLanguage,
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};
