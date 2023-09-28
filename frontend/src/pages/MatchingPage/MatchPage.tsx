import { useContext, useEffect, useRef, useState } from 'react';

import { MatchingContext } from '../../context/MatchingContext';
import MatchingController from '../../controllers/matching/matching.controller';
import MatchingModal from './components/MatchingModal';
import ThreeTier from './components/ThreeTier';

const MatchPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { foundMatch, establishedConnection, connectionLoading, matchLoading } =
    useContext(MatchingContext)!;

  const [difficulty, setDifficulty] = useState<string>("");
  const [open, setOpen] = useState(false);

  const matchingController = useRef<MatchingController>(
    new MatchingController(),
  );

  useEffect(() => {
    if (
      difficulty == "" ||
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
};

export default MatchPage;
