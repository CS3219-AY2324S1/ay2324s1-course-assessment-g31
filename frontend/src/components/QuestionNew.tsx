import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import parse from 'html-react-parser';
import React from 'react';

import { FullQuestion } from '../interfaces/questionService/fullQuestion/object';
import classNames from '../util/ClassNames';

interface IQuestionProps {
  question: FullQuestion;
}

// to replace Question
function QuestionNew({ question }: IQuestionProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {question.id}. {question.title}
      </h1>

      <div className="mt-3">
        <h2 className="sr-only">Difficulty</h2>
        <p className="text-xl tracking-tight text-gray-900">
          {question.difficulty}
        </p>
      </div>
      <div className="mt-3">
        <h2 className="sr-only">Category</h2>
        <div className="flex flex-row gap-3">
          {question.categories.map((category) => (
            <div key={`${category.name}-${category.questionId}`} className="text-gray-700 underline">
              {parse(category.name)}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="sr-only">Description</h3>

        <div className="space-y-6">
          <div className="text-base text-gray-700">
            {parse(question.description)}
          </div>
        </div>
      </div>

      <section aria-labelledby="details-heading" className="mt-12">
        <h2 id="details-heading" className="sr-only">
          Additional details
        </h2>

        <div className="divide-y divide-gray-200 border-t">
          <Disclosure as="div">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button
                    type="button"
                    className="group relative flex w-full items-center justify-between py-6 text-left"
                  >
                    <span
                      className={classNames(
                        open ? "text-indigo-600" : "text-gray-900",
                        "text-sm font-medium",
                      )}
                    >
                      Examples
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <p className="text-gray-700 whitespace-pre">
                    {question.examples.join("")}
                  </p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as="div">
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button
                    type="button"
                    className="group relative flex w-full items-center justify-between py-6 text-left"
                  >
                    <span
                      className={classNames(
                        open ? "text-indigo-600" : "text-gray-900",
                        "text-sm font-medium",
                      )}
                    >
                      Constraints
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <p className="text-gray-700 whitespace-pre">
                    {question.constraints.join("")}
                  </p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </section>
    </div>
  );
}

export default QuestionNew;
