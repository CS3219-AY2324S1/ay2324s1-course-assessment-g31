import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import parse from "html-react-parser";
import React from "react";

import classNames from "../util/ClassNames";

interface IQuestionDetail {
  name: string;
  items: string[];
}

export interface IQuestion {
  name: string;
  description: string;
  difficulty: string;
  details: IQuestionDetail[];
}

interface IQuestionProps {
  question: IQuestion;
}

function Question({ question }: IQuestionProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {question.name}
      </h1>

      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-xl tracking-tight text-gray-900">
          {question.difficulty}
        </p>
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
          {question.details.map((detail) => (
            <Disclosure as="div" key={detail.name}>
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
                        {detail.name}
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
                    <ul>
                      {detail.items.map((item) => (
                        <li key={item}>
                          <div className="text-gray-700">{parse(item)}</div>
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Question;
