import { useContext, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Chat from "../../../components/Chat";
import CodingSpace from "../../../components/CodingSpace";
import PageContainer from "../../../components/container/Page";
import Question from "../../../components/Question";
import { useAuth } from "../../../context/AuthContext";
import { MatchingContext } from "../../../context/MatchingContext";
import { QuestionContext } from "../../../context/QuestionContext";
import InMatchingHoc from "../../../components/hocs/InMatchingHoc";
import { CollaborationContext } from "../../../context/CollaborationContext";

export default function SingleQuestionPage() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { matchedUserId, matchingId, cancelCollaboration } =
    useContext(MatchingContext);
  const { currentUser } = useAuth();
  const { setQuestionId, setHistoryId, selectedLanguage } =
    useContext(QuestionContext);
  const { currentCode } = useContext(CollaborationContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (questionId) {
      setQuestionId(parseInt(questionId, 10));
    }
  }, [questionId, setQuestionId]);

  useEffect(() => {
    const historyId = searchParams.get("historyId");
    if (historyId) {
      setHistoryId(historyId);
    }
  }, [searchParams, setHistoryId]);

  const handleCancelCollaboration = () => {
    if (!currentUser) return;
    cancelCollaboration(currentCode, selectedLanguage);
    navigate("/match");
  };

  return (
    <PageContainer>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 xl:grid-cols-3 xl:gap-x-12">
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 xl:col-span-2">
          <Question />
          <CodingSpace />
        </div>

        <InMatchingHoc currentUser={currentUser} matchingId={matchingId}>
          <div className="flex flex-col">
            <div className="flex mb-4">
              <div className="mr-4 flex-shrink-0">
                <svg
                  className="h-16 w-16 border border-gray-300 bg-white text-gray-300 rounded-full"
                  preserveAspectRatio="none"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={1}
                    d="M0 0l200 200M0 200L200 0"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  {matchedUserId === "" ? (
                    <div className="animate-pulse h-5 bg-gray-700 dark:bg-gray-300 rounded col-span-3" />
                  ) : (
                    <h4 className="text-lg font-bold">{matchedUserId}</h4>
                  )}

                  <p className="text-gray-900 dark:text-gray-100">
                    Current Match
                  </p>
                </div>
                <div className="flex">
                  {matchingId === "" ? (
                    <div className="animate-pulse h-5 bg-gray-700 dark:bg-gray-300 rounded col-span-3" />
                  ) : (
                    <h4 className="text-lg font-bold">{matchingId}</h4>
                  )}

                  <p className="col-span-2 mt-1 text-gray-900 dark:text-gray-100">
                    Match Id
                  </p>
                </div>
                {matchedUserId && matchingId && (
                  <div className="flex">
                    <button
                      type="button"
                      className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      onClick={handleCancelCollaboration}
                    >
                      Cancel Match
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Chat />
          </div>
        </InMatchingHoc>
      </div>
    </PageContainer>
  );
}
