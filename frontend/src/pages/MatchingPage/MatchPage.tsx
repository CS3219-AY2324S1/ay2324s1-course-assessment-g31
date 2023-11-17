import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MatchingContext } from "../../context/MatchingContext";
import MatchingController from "../../controllers/matching/matching.controller";
import useTimer from "../../util/useTimer";
import { useAuth } from "../../context/AuthContext";
import ThreeTier from "./components/ThreeTier";
import MatchingModal from "./components/MatchingModal";

function MatchPage() {
  const { currentUser } = useAuth();
  const {
    foundMatch,
    establishedConnection,
    connectionLoading,
    matchLoading,
    matchedUserId,
    matchingId,
    beginCollaboration,
  } = useContext(MatchingContext);

  const [difficulty, setDifficulty] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [currentMatchingRequestId, setCurrentMatchingRequestId] =
    useState<string>("");

  const navigate = useNavigate();

  const matchingController = useMemo(() => new MatchingController(), []);

  const { time, startTimer, stopTimer, resetTimer, isActive, percent } =
    useTimer(30);

  const cancelMatch = useCallback(async () => {
    if (!currentUser) return;
    setOpen(false);
    setDifficulty("");
    stopTimer();
    if (currentMatchingRequestId !== "") {
      await matchingController.cancelMatchingRequest(currentMatchingRequestId);
    }
  }, [currentUser, stopTimer, currentMatchingRequestId, matchingController]);

  const startMatching = useCallback(
    async (newDifficulty: string) => {
      if (newDifficulty === "") return;
      setDifficulty(newDifficulty);
      if (foundMatch || !currentUser) {
        return;
      }
      resetTimer();
      setOpen(true);
      startTimer();
      if (!establishedConnection) {
        return;
      }
      const obj = {
        userId: currentUser.uid,
        difficulty: newDifficulty,
      };
      const res = await matchingController.createMatchingRequest(obj);
      if (res && res.data) {
        setCurrentMatchingRequestId(res.data.id.toString());
      }
    },
    [
      currentUser,
      establishedConnection,
      foundMatch,
      startTimer,
      resetTimer,
      matchingController,
    ],
  );

  useEffect(() => {
    if (!isActive) {
      cancelMatch();
    }
  }, [isActive, cancelMatch, time]);

  useEffect(() => {
    if (
      currentUser &&
      foundMatch &&
      matchedUserId !== "" &&
      matchingId !== ""
    ) {
      setOpen(false);
      beginCollaboration();
      navigate("/questions/1");
    }
  }, [
    foundMatch,
    matchedUserId,
    matchingId,
    currentUser,
    beginCollaboration,
    navigate,
  ]);

  return (
    <div className="space-y-16 py-16 xl:space-y-20">
      <ThreeTier startMatching={startMatching} />
      <MatchingModal
        difficulty={difficulty}
        open={open}
        setOpen={setOpen}
        connectionLoading={connectionLoading}
        connectionSuccess={establishedConnection}
        matchLoading={matchLoading}
        matchSuccess={foundMatch}
        cancelMatch={cancelMatch}
        waitingPercentage={percent}
      />
    </div>
  );
}

export default MatchPage;
