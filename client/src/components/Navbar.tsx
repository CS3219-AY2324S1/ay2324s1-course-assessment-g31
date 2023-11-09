import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

import { AuthContext } from "../context/FirebaseAuthContext";
import classNames from "../util/ClassNames";
import DarkModeToggle from "./toggle/darkModeToggle/DarkModeToggle";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

function Navbar() {
  const navigation = useRef([
    // { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Questions", href: "/questions", current: false },
    { name: "Match", href: "/match", current: false },
  ]);
  const userNavigationLoggedIn = [
    { name: "Your Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
    { name: "Sign out", href: "/sign-out" },
  ];
  const userNavigationLoggedOut = [{ name: "Sign in", href: "/sign-in" }];

  useEffect(() => {
    const currentPath = window.location.pathname;
    navigation.current = navigation.current.map((item) => {
      const curr = item;
      if (curr.href === currentPath) {
        curr.current = true;
      } else {
        curr.current = false;
      }
      return curr;
    });
  }, []);

  const { currentUser } = useContext(AuthContext);

  return (
    <Disclosure as="nav" className="bg-gray-100 dark:bg-slate-800 shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Your Company"
                    />
                  </Link>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.current.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "border-indigo-500 text-gray-900 dark:text-gray-100"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="inline-flex items-center px-1 pt-1 text-sm font-medium">
                <p className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300">
                  {currentUser !== null
                    ? currentUser.email
                    : "No user signed in"}
                </p>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className={classNames(
                    "relative rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:ring-indigo-500",
                  )}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button
                      type="button"
                      className={classNames(
                        "relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
                        "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:ring-indigo-500",
                      )}
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {currentUser ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 rounded-full" />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-100 dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {currentUser
                        ? userNavigationLoggedIn.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <NavLink
                                  to={item.href}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 dark:bg-gray-800"
                                      : "",
                                    "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                                  )}
                                >
                                  {item.name}
                                </NavLink>
                              )}
                            </Menu.Item>
                          ))
                        : userNavigationLoggedOut.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <NavLink
                                  to={item.href}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 dark:bg-gray-800"
                                      : "",
                                    "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                                  )}
                                >
                                  {item.name}
                                </NavLink>
                              )}
                            </Menu.Item>
                          ))}
                    </Menu.Items>
                  </Transition>
                </Menu>

                <div className="relative ml-3">
                  <DarkModeToggle />
                </div>
              </div>

              {/* Mobile Navbar */}
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-2 text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.current.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  className={classNames(
                    item.current
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-950 dark:hover:text-gray-200",
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <Link to={item.href}>{item.name}</Link>
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {currentUser ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 rounded-full" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 p-1 text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {currentUser
                  ? userNavigationLoggedIn.map((item) => (
                      <Link to={item.href}>
                        <Disclosure.Button
                          key={item.name}
                          as="button"
                          className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          {item.name}
                        </Disclosure.Button>
                      </Link>
                    ))
                  : userNavigationLoggedOut.map((item) => (
                      <Link to={item.href}>
                        <Disclosure.Button
                          key={item.name}
                          as="button"
                          className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          {item.name}
                        </Disclosure.Button>
                      </Link>
                    ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
