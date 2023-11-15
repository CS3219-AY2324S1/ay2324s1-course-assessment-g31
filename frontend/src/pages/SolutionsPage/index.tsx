import React, { useContext, useState } from "react";

import { QuestionContext } from "../../context/QuestionContext";
import classNames from "../../util/ClassNames";

import Solution from "../../components/Solution";
import { QuestionSolution } from "../../interfaces/questionService/questionSolution/object";
import PageContainer from "../../components/container/Page";

export default function SolutionsPage() {
  const { question } = useContext(QuestionContext);
  const [selectedSolution, setSelectedSolution] = useState<QuestionSolution>();

  return (
    <PageContainer>
      <div className="flex flex-row items-start">
        <table className="w-1/2 divide-y divide-gray-300 p-4">
          <thead className="">
            <tr>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Language
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-gray-100 dark:bg-gray-800">
            {question.solutions.length > 0 ? (
              question.solutions.map((solution) => (
                <tr key={solution.id}>
                  <td>
                    <button
                      type="button"
                      className={classNames(
                        " hover:text-indigo-900 dark:hover:text-indigo-100 font-bold",
                        `${
                          selectedSolution?.id === solution.id
                            ? "text-indigo-900 dark:text-indigo-100 underline"
                            : "text-indigo-600 dark:text-indigo-400"
                        } `,
                      )}
                      onClick={() => setSelectedSolution(solution)}
                    >
                      {solution.title}
                    </button>
                  </td>
                  <td
                    className={classNames(
                      "whitespace-nowrap px-3 py-4 text-sm",
                      "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {solution.language}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No Solutions
                    </h3>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-1/2 px-5">
          {selectedSolution ? (
            <Solution solution={selectedSolution} />
          ) : (
            <h2>Select a solution</h2>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
