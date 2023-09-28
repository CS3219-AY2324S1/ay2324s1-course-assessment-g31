import { useContext, useEffect, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { MatchingContext } from "../../context/MatchingContext";
import MatchingController from "../../controllers/matching/matching.controller";
import MatchingModal from "./components/MatchingModal";
import ThreeTier from "./components/ThreeTier";

function MatchPage() {
  const { currentUser } = useAuth();
  const { foundMatch, establishedConnection, connectionLoading, matchLoading } =
    useContext(MatchingContext)!;

  const [difficulty, setDifficulty] = useState<string>("");
  const [open, setOpen] = useState(false);

  const matchingController = useRef<MatchingController>(
    new MatchingController(),
  );

  useEffect(() => {
    console.log("MatchPage: useEffect: currentUser:", currentUser);
    if (
      difficulty.length === 0 ||
      foundMatch ||
      !establishedConnection ||
      !currentUser
    ) {
      return;
    }
    setOpen(true);

    matchingController.current.createMatchingRequest({
      userId: currentUser!.uid,
      difficulty,
    });
  }, [difficulty, foundMatch, establishedConnection, currentUser]);

  const cancelMatch = () => {
    setOpen(false);
    matchingController.current.cancelMatchingRequest({
      userId: currentUser!.uid,
    });
  };

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
