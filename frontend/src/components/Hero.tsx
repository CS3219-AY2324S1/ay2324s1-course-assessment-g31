import classNames from "../util/ClassNames";
import ComponentContainer from "./container/Component";

function Hero() {
  return (
    <ComponentContainer>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          Collaborate. Code. Conquer.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Master coding interviews together now with our collaborative platform.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/sign-in"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started now
          </a>
          {/* <a
            href="/learn-more"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
          >
            Learn more <span aria-hidden="true">→</span>
          </a> */}
        </div>
      </div>
      <div className="mt-16 flow-root sm:mt-24">
        <div
          className={classNames(
            "-m-2 rounded-xl p-2 ring-1 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4",
            "bg-gray-900/5 dark:bg-gray-100/5 ring-gray-900/10 dark:ring-gray-900/10",
          )}
        >
          <img
            src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
            alt="App screenshot"
            width={2432}
            height={1442}
            className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
          />
        </div>
      </div>
    </ComponentContainer>
  );
}

export default Hero;
