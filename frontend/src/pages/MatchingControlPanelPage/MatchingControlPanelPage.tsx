import { useEffect, useState } from "react";
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
          <p className="text-center text-gray-500">No one in queue</p>
        )}
      </ul>
    </div>
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

  const matchingController = new MatchingController();

  useEffect(() => {
    matchingController.getMatchingRequests().then((res) => {
      setRequests(res);
    });
  }, []);

  useEffect(() => {
    setEasyQueueRequests(
      requests.filter((request) => request.difficulty === "easy"),
    );
    setMediumQueueRequests(
      requests.filter((request) => request.difficulty === "medium"),
    );
    setHardQueueRequests(
      requests.filter((request) => request.difficulty === "hard"),
    );
  }, [requests]);

  return (
    <PageContainer>
      <div className="flex flex-row w-full justify-around">
        <SingleQueue title="Easy Queue" requests={easyQueueRequests} />
        <SingleQueue title="Medium Queue" requests={mediumQueueRequests} />
        <SingleQueue title="Hard Queue" requests={hardQueueRequests} />
      </div>
    </PageContainer>
  );
}

export default MatchingControlPanelPage;
