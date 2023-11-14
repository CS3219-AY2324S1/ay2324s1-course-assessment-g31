import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { QuestionContext } from "../context/QuestionContext";

function QuestionAttemptList() {
  const { questionHistories } = useContext(QuestionContext);
  const navigate = useNavigate();

  function handleAttemptAgain(id: string) {
    const selectedHistory = questionHistories.filter((x) => x.id === id)[0];
    if (selectedHistory) {
      navigate(
        `/questions/${selectedHistory.questionId}?history=${selectedHistory.id}`,
      );
    }
  }

  return (
    <div className="bg-gray-50 shadow rounded-lg p-4 min-h-full">
      <h1 className="mt-2 text-sm font-semibold text-gray-900 border-b pb-4">
        Question Attempts
      </h1>
      <ul className="divide-y divide-gray-100">
        {questionHistories.map((history) => (
          <li
            key={history.id}
            className="flex flex-wrap items-center justify-between gap-x-6 py-5 border-b border-gray-200"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  Question #{history.questionId}
                </p>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="block">
                  Attempted on{" "}
                  {new Date(history.createdAt.toString()).toLocaleDateString()}{" "}
                  with {history.user2Id}
                </p>
              </div>
            </div>
            <div className="flex flex-grow mt-2">
              <button
                type="button"
                onClick={() => handleAttemptAgain(history.id)}
                className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Attempt Again
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionAttemptList;
