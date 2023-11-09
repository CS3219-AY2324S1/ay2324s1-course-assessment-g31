import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Cog6ToothIcon,
  FolderIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";

import classNames from "../util/ClassNames";
import DarkModeToggle from "./toggle/darkModeToggle/DarkModeToggle";

const navigation = [
  { name: "Questions", href: "#", icon: FolderIcon, current: false },
  { name: "Users", href: "#", icon: ServerIcon, current: true },
  { name: "Activity", href: "#", icon: SignalIcon, current: false },
  { name: "Settings", href: "#", icon: Cog6ToothIcon, current: false },
];
const activityItems = [
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    projectName: "ios-app",
    commit: "2d89f0c8",
    branch: "main",
    date: "1h",
    dateTime: "2023-01-23T11:00",
  },
  // More items...
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 xl:hidden"
          onClose={setSidebarOpen}
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
            <div className="fixed inset-0 bg-gray-100/80 dark:bg-gray-800/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-dark dark:text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-100 dark:bg-gray-800 px-6 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-200 dark:bg-gray-800 text-dark dark:text-white"
                                    : "text-gray-400 hover:text-dark dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="-mx-6 mt-auto">
                        <a
                          href="/help-me"
                          className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <img
                            className="h-8 w-8 rounded-full bg-gray-800"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <span className="sr-only">Your profile</span>
                          <span aria-hidden="true">Tom Cook</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
            <div className="">
              <DarkModeToggle />
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-200 dark:bg-gray-800 text-dark dark:text-white"
                            : "text-gray-400 hover:text-dark dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <a
                  href="/help-me"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <img
                    className="h-8 w-8 rounded-full bg-gray-800"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Tom Cook</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="xl:pl-72">
        {/* Sticky search header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-black/5 dark:border-white/5 bg-gray-100 dark:bg-gray-800 px-4 shadow-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-dark dark:text-white xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-dark dark:text-white focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>

        <main className="lg:pr-96">
          <Outlet />
        </main>

        {/* Activity feed */}
        <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h2 className="text-base font-semibold leading-7 text-dark dark:text-white">
              Activity feed
            </h2>
            <a
              href="/help-me"
              className="text-sm font-semibold leading-6 text-indigo-400"
            >
              View all
            </a>
          </header>
          <ul className="divide-y divide-white/5">
            {activityItems.map((item) => (
              <li key={item.commit} className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-x-3">
                  <img
                    src={item.user.imageUrl}
                    alt=""
                    className="h-6 w-6 flex-none rounded-full bg-gray-800"
                  />
                  <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-dark dark:text-white">
                    {item.user.name}
                  </h3>
                  <time
                    dateTime={item.dateTime}
                    className="flex-none text-xs text-gray-400 dark:text-gray-600"
                  >
                    {item.date}
                  </time>
                </div>
                <p className="mt-3 truncate text-sm text-gray-500">
                  Pushed to{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.projectName}
                  </span>{" "}
                  (
                  <span className="font-mono text-gray-600 dark:text-gray-400">
                    {item.commit}
                  </span>{" "}
                  on{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.branch}
                  </span>
                  )
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
