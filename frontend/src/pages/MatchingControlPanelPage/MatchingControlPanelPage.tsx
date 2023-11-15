import { useEffect, useState, useMemo } from "react";

import PageContainer from "../../components/container/Page";
import MatchingController from "../../controllers/matching/matching.controller";

interface MatchingRequest {
  id: number;
  userId: string;
  questionId: number | null;
  difficulty: string;
  dateRequested: Date;
  success: boolean;
}

interface Matching {
  id: number;
  user1Id: string;
  user2Id: string;
  requestId: number;
  dateTimeMatched: Date;
}

function SingleQueue({
  title,
  requests,
}: {
  title: string;
  requests: MatchingRequest[];
}) {
  return (
    <div>
      <h1 className="text-large font-bold text-gray-900 mb-2">{title}</h1>
      <ul className="divide-y divide-gray-100">
        {requests.length > 0 ? (
          requests.map((request) => (
            <li
              key={request.userId}
              className="flex justify-between gap-x-6 p-3 rounded-md border shadow-md mb-2"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {request.userId}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {request.dateRequested.toString()}
                  </p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="bg-gray-100 text-center text-gray-500 p-4 rounded-md shadow-md">
            No one in queue
          </p>
        )}
      </ul>
    </div>
  );
}

function MatchingList({ matchings }: { matchings: Matching[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {matchings && matchings.length > 0 ? (
        matchings.map((matching) => (
          <li
            key={`${matching.user1Id}-${matching.user2Id}-${matching.requestId}`}
            className="bg-gray-100 flex justify-between gap-x-6 p-3 rounded-md border shadow-md mb-2"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {matching.user1Id} successfully matched with{" "}
                  {matching.user2Id}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {matching.dateTimeMatched.toString()}
                </p>
              </div>
            </div>
          </li>
        ))
      ) : (
        <p className="bg-gray-100 text-center text-gray-500">
          No successful matchings
        </p>
      )}
    </ul>
  );
}

function MatchingControlPanelPage() {
  const [requests, setRequests] = useState<MatchingRequest[]>([]);
  const [easyQueueRequests, setEasyQueueRequests] = useState<MatchingRequest[]>(
    [],
  );
  const [mediumQueueRequests, setMediumQueueRequests] = useState<
    MatchingRequest[]
  >([]);
  const [hardQueueRequests, setHardQueueRequests] = useState<MatchingRequest[]>(
    [],
  );

  const [matchings, setMatchings] = useState<Matching[]>([]);

  const matchingController = useMemo(() => new MatchingController(), []);

  useEffect(() => {
    matchingController.getMatchingRequests().then((res) => {
      if (res && res.data) {
        setRequests(res.data);
      }
    });
  }, [matchingController]);

  useEffect(() => {
    matchingController.getMatchings().then((res) => {
      if (res && res.data) {
        setMatchings(res.data);
      }
    });
  }, [matchingController]);

  useEffect(() => {
    if (requests) {
      setEasyQueueRequests(
        requests.filter(
          (request) => request.difficulty.toLowerCase() === "easy" && !request.success,
        ),
      );
      setMediumQueueRequests(
        requests.filter(
          (request) => request.difficulty.toLowerCase() === "medium" && !request.success,
        ),
      );
      setHardQueueRequests(
        requests.filter(
          (request) => request.difficulty.toLowerCase() === "hard" && !request.success,
        ),
      );
    }
  }, [requests]);

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        <div className="bg-slate-300 p-5">
          <h1 className="text-xl font-bold mb-5 text-center">
            Active Matching Requests
          </h1>
          <div className="flex flex-row w-full justify-around">
            <SingleQueue title="Easy Queue" requests={easyQueueRequests} />
            <SingleQueue title="Medium Queue" requests={mediumQueueRequests} />
            <SingleQueue title="Hard Queue" requests={hardQueueRequests} />
          </div>
        </div>

        <div className="bg-slate-300 p-5">
          <h1 className="text-xl font-bold mb-5 text-center">
            Successful Matching
          </h1>
          <div className="flex flex-row w-full justify-around">
            <MatchingList matchings={matchings} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default MatchingControlPanelPage;
