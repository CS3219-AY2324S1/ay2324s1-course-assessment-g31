import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Chat from "../../components/Chat";
import CodingSpace from "../../components/CodingSpace";
import PageContainer from "../../components/container/Page";
import Question, { IQuestion } from "../../components/Question";
import { MatchingContext } from "../../context/MatchingContext";
import QuestionLanguageContext from "../../context/QuestionLanguageContext";
import { useAuth } from "../../context/AuthContext";

export default function SingleQuestionPage() {
  const { matchedUserId, matchingId, cancelCollaboration } =
    useContext(MatchingContext);
  const { currentUser } = useAuth();

  const [searchParams] = useSearchParams();
  const selectedLanguage = searchParams.get("lang");
  const navigate = useNavigate();

  const question: IQuestion = {
    name: "Two Sum",
    difficulty: "Easy",
    description: `
          <p>
          Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
          You may assume that each input would have exactly one solution, and you may not use the same element twice.
          You can return the answer in any order.
          </p>
        `,
    details: [
      {
        name: "Examples",
        items: [
          `<p>Input: nums = [2,7,11,15], target = 9</p>
                    <p>Output: [0,1]</p>
                    <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]</p>`,
          `<p>Input: nums = [3,2,4], target = 6</p>
                    <p>Output: [1,2]</p>`,
          `<p>Input: nums = [3,3], target = 6</p>
                    <p>Output: [0,1]</p>`,
        ],
      },
      {
        name: "Constraints",
        items: [
          "2 <= nums.length <= 104",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists",
        ],
      },
      // More sections...
    ],
  };

  const handleCancelCollaboration = () => {
    if (!currentUser) return;
    cancelCollaboration();
    navigate("/match");
  };

  return (
    <PageContainer>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 xl:grid-cols-3 xl:gap-x-12">
        {/* Product info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 xl:col-span-2">
          {currentUser && (
            <QuestionLanguageContext.Provider value={selectedLanguage}>
              <Question question={question} />
              <CodingSpace />
            </QuestionLanguageContext.Provider>
          )}
        </div>

        {/* Image gallery */}
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
      </div>
    </PageContainer>
  );
}
