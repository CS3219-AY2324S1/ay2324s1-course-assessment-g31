import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { MatchingContext } from "../../context/MatchingContext";
import MatchingController from "../../controllers/matching/matching.controller";
import MatchingModal from "./components/MatchingModal";
import ThreeTier from "./components/ThreeTier";

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
    matchedQuestionId
  } = useContext(MatchingContext);

  const [difficulty, setDifficulty] = useState<string>("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const matchingController = useRef<MatchingController>(
    new MatchingController(),
  );

  useEffect(() => {
    if (difficulty === "" || foundMatch || !currentUser) {
      return;
    }
    setOpen(true);

    matchingController.current.createMatchingRequest({
      userId: currentUser.uid,
      difficulty,
    });
  }, [difficulty, foundMatch, currentUser]);

  const cancelMatch = () => {
    if (!currentUser) return;
    setOpen(false);
    matchingController.current.cancelMatchingRequest({
      userId: currentUser.uid,
    });
  };

  useEffect(() => {
    if (
      currentUser &&
      foundMatch &&
      matchedUserId !== "" &&
      matchingId !== ""
    ) {
      setOpen(false);
      beginCollaboration();
      navigate(`/questions/${matchedQuestionId}/?lang=javascript`);
    }
  }, [
    foundMatch,
    matchedUserId,
    matchingId,
    currentUser,
    beginCollaboration,
    navigate,
    matchedQuestionId
  ]);

  return (
    <div className="space-y-16 py-16 xl:space-y-20">
      <ThreeTier setDifficulty={setDifficulty} />
      <MatchingModal
        difficulty={difficulty}
        open={open}
        setOpen={setOpen}
        connectionLoading={connectionLoading}
        connectionSuccess={establishedConnection}
        matchLoading={matchLoading}
        matchSuccess={foundMatch}
        cancelMatch={cancelMatch}
      />
    </div>
  );
}

export default MatchPage;
