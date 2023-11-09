import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";

import { QuestionContext } from "../context/QuestionContext";
import classNames from "../util/ClassNames";

function Question() {
  const { question } = useContext(QuestionContext);
  return question ? (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {question.title}
      </h1>

      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-xl tracking-tight text-gray-900 dark:text-gray-100">
          {question.difficulty}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="sr-only">Description</h3>

        <div className="space-y-6">
          <p className="text-base text-gray-700 dark:text-gray-300">
            {question.content}
          </p>
        </div>
      </div>

      <section aria-labelledby="details-heading" className="mt-12">
        <h2 id="details-heading" className="sr-only">
          Additional details
        </h2>

        <div className="divide-y divide-gray-200 dark:divide-gray-800 border-t">
          <Disclosure as="div" key="constraints">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button
                    type="button"
                    className="group relative flex w-full items-center justify-between py-6 text-left"
                  >
                    <span
                      className={classNames(
                        open
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-900 dark:text-gray-100",
                        "text-sm font-medium",
                      )}
                    >
                      Constraints
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500 dark:text-indigo-600 dark:group-hover:text-indigo-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <ul>
                    {question.constraints.map((item) => (
                      <li key={item}>
                        <p className="text-gray-700 dark:text-gray-300">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as="div" key="examples">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button
                    type="button"
                    className="group relative flex w-full items-center justify-between py-6 text-left"
                  >
                    <span
                      className={classNames(
                        open
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-900 dark:text-gray-100",
                        "text-sm font-medium",
                      )}
                    >
                      Examples
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500 dark:text-indigo-600 dark:group-hover:text-indigo-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <ul>
                    {question.examples.map((item) => (
                      <li key={item}>
                        <p className="text-gray-700 dark:text-gray-300">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </section>
    </div>
  ) : (
    <p>Loading</p>
  );
}

export default Question;
