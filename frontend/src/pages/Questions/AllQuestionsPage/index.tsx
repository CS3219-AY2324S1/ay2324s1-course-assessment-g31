import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageContainer from "../../../components/container/Page";
import { QuestionContext } from "../../../context/QuestionContext";
import classNames from "../../../util/ClassNames";

function AllQuestionPage() {
  const { questions, setQuestionQuery } = useContext(QuestionContext);

  const PAGINATION_SIZE = 10;

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(0);

  enum SortBy {
    ASC = "asc",
    DESC = "desc",
  }

  const [sortByStatus, setSortByStatus] = useState<SortBy>(SortBy.ASC);
  const [sortByTitle, setSortByTitle] = useState<SortBy>(SortBy.ASC);
  const [sortByDifficulty, setSortByDifficulty] = useState<SortBy>(SortBy.ASC);

  useEffect(() => {
    if (questions.length > 1) {
      setMaxPageNumber(Math.floor(questions.length / PAGINATION_SIZE));
    }
  }, [questions]);

  const [filters, setFilters] = useState([
    {
      id: "category",
      name: "Category",
      options: [
        { value: "Strings", label: "Strings", checked: true },
        { value: "DataStructures", label: "DataStructures", checked: true },
        { value: "Algorithms", label: "Algorithms", checked: true },
        { value: "BitManipulation", label: "BitManipulation", checked: true },
        { value: "Databases", label: "Databases", checked: true },
        { value: "Arrays", label: "Arrays", checked: true },
        { value: "Brainteaser", label: "Brainteaser", checked: true },
        { value: "Recursion", label: "Recursion", checked: true },
      ],
    },
  ]);

  const activeFilters = useMemo(
    () =>
      filters.flatMap((x) =>
        x.options
          .filter((y) => y.checked)
          .map((z) => ({ value: z.value, label: z.label })),
      ),
    [filters],
  );

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  function handleCategoryChange(selectedCategory: string) {
    setFilters(
      filters
        .filter((x) => x.id !== "category")
        .concat(
          filters
            .filter((x) => x.id === "category")
            .map((curr) => ({
              ...curr,
              options: curr.options.map((x) => {
                if (x.value === selectedCategory) {
                  return { ...x, checked: !x.checked };
                }
                return x;
              }),
            })),
        ),
    );
  }

  useEffect(() => {
    setQuestionQuery((prevState) => ({
      ...prevState,
      categories: activeFilters.map((x) => ({
        value: { name: x.value, questionId: 0 },
        order: "asc",
        sortBy: false,
      })),
    }));
  }, [setQuestionQuery, activeFilters]);

  return (
    <PageContainer>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFilterOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 sm:hidden"
          onClose={setMobileFilterOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white overflow-y-auto py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md  p-2 text-gray-400"
                    onClick={() => setMobileFilterOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  <div className="p-4">
                    <label
                      htmlFor="questionName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Question Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="questionName"
                        id="questionName"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Two Sum"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      name="location"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue="Canada"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.name}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between  px-2 py-3 text-sm text-gray-400">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? "-rotate-180" : "rotate-0",
                                    "h-5 w-5 transform",
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={() => {
                                      handleCategoryChange(option.value);
                                    }}
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Unleash Your Problem-Solving Prowess
        </h1>
        <p className="mt-4 max-w-xl text-sm text-gray-700">
          Dive into a comprehensive collection of curated coding challenges,
          meticulously designed to refine your skills and prepare you for any
          technical hurdle. Our diverse question bank covers a spectrum of
          complexity levels, ensuring there&apos;s something for every coding
          enthusiast, from beginners to seasoned professionals.
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Random Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-gray-200  pb-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row">
              <div className="p-4">
                <label
                  htmlFor="questionName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Question Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="questionName"
                    id="questionName"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Two Sum"
                  />
                </div>
              </div>
              <div className="p-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue="Canada"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setMobileFilterOpen(true)}
            >
              Filters
            </button>

            <div className="hidden sm:block">
              <div className="flow-root">
                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                  {filters.map((section) => (
                    <Popover
                      key={section.name}
                      className="relative inline-block px-4 text-left"
                    >
                      <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{section.name}</span>
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <form className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={() => {
                                    handleCategoryChange(option.value);
                                  }}
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ))}
                </Popover.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Active filters */}
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="text-sm font-medium text-gray-500">
              Filters
              <span className="sr-only">, active</span>
            </h3>

            <div
              aria-hidden="true"
              className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
            />

            <div className="mt-2 sm:ml-4 sm:mt-0">
              <div className="-m-1 flex flex-wrap items-center">
                {activeFilters.map((activeFilter) => (
                  <span
                    key={activeFilter.value}
                    className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                  >
                    <span>{activeFilter.label}</span>
                    <button
                      type="button"
                      className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Remove filter for {activeFilter.label}
                      </span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                            onClick={() => setSortByDifficulty(SortBy.DESC)}
                          />
                        ) : (
                          <ChevronDownIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                            onClick={() => setSortByDifficulty(SortBy.ASC)}
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
                  <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
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
            of <span className="font-medium">{questions.length}</span> results
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
                pageNumber + 1 < maxPageNumber ? pageNumber + 1 : maxPageNumber,
              )
            }
            disabled={pageNumber === maxPageNumber}
            className="relative ml-3 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950 focus-visible:outline-offset-0"
          >
            Next
          </button>
        </div>
      </nav>
    </PageContainer>
  );
}
export default AllQuestionPage;
