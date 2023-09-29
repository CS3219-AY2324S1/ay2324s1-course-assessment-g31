import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import ComponentContainer from "./Container/Component";
import titleCase from "../../../util/titleCase";

const tiers = [
  {
    name: "easy",
    id: "tier-easy",
    href: "/match/easy",
    number: 123,
    description: "Easy leetcode questions to get you started.",
    features: ["Two Sum", "Palindrome Number", "Valid Parentheses"],
  },
  {
    name: "medium",
    id: "tier-medium",
    href: "/match/medium",
    number: 456,
    description: "Medium leetcode questions to grow you.",
    features: [
      "Add Two Numbers",
      "Reverse Integer",
      "Container With Most Water",
    ],
  },
  {
    name: "hard",
    id: "tier-hard",
    href: "/match/hard",
    number: 789,
    description: "Hard leetcode questions to challenge you.",
    features: ["Merge K Sorted Lists", "Trapping Rain Water", "N-Queens"],
  },
];

interface IThreeTierProps {
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
}

function ThreeTier({ setDifficulty }: IThreeTierProps) {
  return (
    <ComponentContainer>
      <div className="mx-auto max-w-4xl sm:text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Matching
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose the right question for&nbsp;you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">
        Match and attempt a random question from the selected difficulty with a
        friend.
      </p>
      <div className="mt-20 flow-root">
        <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
              <h3
                id={tier.id}
                className="text-base font-semibold leading-7 text-gray-900"
              >
                {titleCase(tier.name)}
              </h3>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  {tier.number}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  questions
                </span>
              </p>
              <button
                type="button"
                aria-describedby={tier.id}
                className="mt-10 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  setDifficulty(tier.name);
                }}
              >
                Match and Attempt
              </button>
              <p className="mt-10 text-sm font-semibold leading-6 text-gray-900">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircleIcon
                      className="h-6 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {titleCase(feature)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </ComponentContainer>
  );
}

export default ThreeTier;
