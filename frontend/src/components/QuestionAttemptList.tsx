import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CollaborationContext } from "../context/CollaborationContext";
import { CodingLanguage, QuestionContext } from "../context/QuestionContext";
import { decode64 } from "../util/base64";

function QuestionAttemptList() {
    const { questionHistories, setSelectedLanguage, setQuestionId } =
        useContext(QuestionContext);
    const { setCurrentCode } = useContext(CollaborationContext);
    const navigate = useNavigate();

    function handleAttemptAgain(id: string) {
        const selectedHistory = questionHistories.filter((x) => x.id === id)[0];
        if (selectedHistory) {
            setSelectedLanguage(selectedHistory.language as CodingLanguage);
            setQuestionId(selectedHistory.questionId);
            setCurrentCode(decode64(selectedHistory.code));
            navigate(`/questions/${selectedHistory.questionId}`);
        }
    }

    return (
        <div className="bg-gray-50 shadow-lg rounded-lg p-4 min-h-full">
            <h1>Question Attempts</h1>
            <ul className="divide-y divide-gray-100">
                {questionHistories.map((history) => (
                    <li
                        key={history.id}
                        className="flex items-center justify-between gap-x-6 py-5"
                    >
                        <div className="min-w-0">
                            <div className="flex items-start gap-x-3">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                    {history.questionId}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                <p className="whitespace-nowrap">
                                    Attempted on{" "}
                                    <time dateTime={history.createdAt.toString()}>
                                        {history.createdAt.toString()}
                                    </time>
                                </p>
                                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                    <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className="truncate">Attempted with {history.user2Id}</p>
                            </div>
                        </div>
                        <div className="flex flex-none items-center gap-x-4">
                            <button
                                type="button"
                                onClick={() => handleAttemptAgain(history.id)}
                                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                            >
                                Attempt again
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default QuestionAttemptList;
