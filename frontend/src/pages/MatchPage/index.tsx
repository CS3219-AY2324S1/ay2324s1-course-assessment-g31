import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MatchingModal from "../../components/MatchingModal";
import ThreeTier from "../../components/ThreeTier";
import { MatchingContext } from "../../context/MatchingContext";
import MatchingController from "../../controllers/matching/matching.controller";
import useTimer from "../../util/useTimer";
import { useAuth } from "../../context/AuthContext";

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

  const navigate = useNavigate();

  const matchingController = useRef<MatchingController>(
    new MatchingController(),
  );

  const { time, startTimer, stopTimer, resetTimer, isActive, percent } =
    useTimer(10);

  const cancelMatch = useCallback(() => {
    if (!currentUser) return;
    setOpen(false);
    setDifficulty("");
    stopTimer();
    matchingController.current.cancelMatchingRequest({
      userId: currentUser.uid,
    });
  }, [currentUser, stopTimer]);

  const startMatching = useCallback(
    (newDifficulty: string) => {
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
      console.log(obj);
      matchingController.current.createMatchingRequest(obj);
    },
    [currentUser, establishedConnection, foundMatch, startTimer, resetTimer],
  );

  useEffect(() => {
    console.log(time);
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
