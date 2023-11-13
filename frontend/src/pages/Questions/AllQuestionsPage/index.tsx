import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "../../../util/ClassNames";
import { QuestionContext } from "../../../context/QuestionContext";

function AllQuestionPage() {
  const { questions } = useContext(QuestionContext);

  const PAGINATION_SIZE = 10;

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [maxPageNumber, _setMaxPageNumber] = useState<number>(
    Math.floor(questions.length / PAGINATION_SIZE),
  );

  enum SortBy {
    ASC = "asc",
    DESC = "desc",
  }

  const [sortByStatus, setSortByStatus] = useState<SortBy>(SortBy.ASC);
  const [sortByTitle, setSortByTitle] = useState<SortBy>(SortBy.ASC);
  const [sortByDifficulty, setSortByDifficulty] = useState<SortBy>(SortBy.ASC);

  return (
    <div className="min-h-full">
      <div className="py-5">
        <main>
          <div className="mx-auto max-w-9xl sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                  Unleash Your Problem-Solving Prowess
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Dive into a comprehensive collection of curated coding
                  challenges, meticulously designed to refine your skills and
                  prepare you for any technical hurdle. Our diverse question
                  bank covers a spectrum of complexity levels, ensuring
                  there&apos;s something for every coding enthusiast, from
                  beginners to seasoned professionals.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Random Question
                </button>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          <button type="button" className="group inline-flex">
                            Status
                            <span className="ml-2 flex-none rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
                              {sortByStatus === SortBy.ASC ? (
                                <ChevronUpIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  onClick={() => setSortByStatus(SortBy.DESC)}
                                />
                              ) : (
                                <ChevronDownIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  onClick={() => setSortByStatus(SortBy.ASC)}
                                />
                              )}
                            </span>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          <button type="button" className="group inline-flex">
                            Title
                            <span className="ml-2 flex-none rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
                              {sortByTitle === SortBy.ASC ? (
                                <ChevronUpIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  onClick={() => setSortByTitle(SortBy.DESC)}
                                />
                              ) : (
                                <ChevronDownIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  onClick={() => setSortByTitle(SortBy.ASC)}
                                />
                              )}
                            </span>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          <button type="button" className="group inline-flex">
                            Difficulty
                            <span className="ml-2 flex-none rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
                              {sortByDifficulty === SortBy.ASC ? (
                                <ChevronUpIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  onClick={() =>
                                    setSortByDifficulty(SortBy.DESC)
                                  }
                                />
                              ) : (
                                <ChevronDownIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                  onClick={() =>
                                    setSortByDifficulty(SortBy.ASC)
                                  }
                                />
                              )}
                            </span>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400"
                        >
                          Tags
                        </th>
                        <th
                          scope="col"
                          className="relative py-3 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Attempt</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-gray-100 dark:bg-gray-800">
                      {questions
                        .slice(
                          pageNumber * PAGINATION_SIZE,
                          (pageNumber + 1) * PAGINATION_SIZE,
                        )
                        .map((question) => (
                          <tr key={question.id}>
                            <td
                              className={classNames(
                                "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0",
                                "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              Not Done
                            </td>
                            <td
                              className={classNames(
                                "whitespace-nowrap px-3 py-4 text-sm",
                                "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              {question.title}
                            </td>
                            <td
                              className={classNames(
                                "whitespace-nowrap px-3 py-4 text-sm",
                                "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              {question.difficulty}
                            </td>
                            {/* <td
                              className={classNames(
                                "whitespace-nowrap px-3 py-4 text-sm",
                                "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              {question.tags.map((tag) => (
                                <span
                                  className={classNames(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                    "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-gray-500/10",
                                  )}
                                >
                                  {tag}
                                </span>
                              ))}
                            </td> */}
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <Link
                                to={`${question.id}`}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-100"
                              >
                                Attempt
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <nav
              className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {pageNumber * PAGINATION_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {(pageNumber + 1) * PAGINATION_SIZE > questions.length
                      ? questions.length
                      : (pageNumber + 1) * PAGINATION_SIZE}
                  </span>{" "}
                  of <span className="font-medium">{questions.length}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setPageNumber(pageNumber - 1 > 0 ? pageNumber - 1 : 0)
                  }
                  disabled={pageNumber === 0}
                  className="relative inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950 focus-visible:outline-offset-0"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPageNumber(
                      pageNumber + 1 < maxPageNumber
                        ? pageNumber + 1
                        : maxPageNumber,
                    )
                  }
                  disabled={pageNumber === maxPageNumber}
                  className="relative ml-3 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950 focus-visible:outline-offset-0"
                >
                  Next
                </button>
              </div>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}
export default AllQuestionPage;
