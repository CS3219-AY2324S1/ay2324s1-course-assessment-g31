import { FirebaseError } from "@firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "@firebase/auth";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../../../context/AuthContext";
import classNames from "../../../util/ClassNames";
import styles from "./UpdateProfileModal.module.css";
import UserController from "../../../controllers/user/user.controller";

interface UpdateProfileModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  //   onClose: (username: string, email: string) => void;
  userId: string;
  emailProp: string | null;
  usernameProp: string | null;
  setUsernameCallback: (username: string) => void;
}

interface TabItem {
  name: string;
  onClick: () => void;
  current: boolean;
}

interface ErrorTabItem {
  flag: boolean;
  statement: string;
}

export default function UpdateProfileModal({
  isOpen,
  setOpen,
  userId,
  emailProp,
  usernameProp,
  setUsernameCallback,
}: UpdateProfileModalProps) {
  const [email, setEmail] = useState(emailProp || "");
  const [username, setUsername] = useState(usernameProp || "");
  const [isPasswordChangeFormOpen, setPasswordChangeFormOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameChangeFormOpen, setUsernameChangeFormOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [invalidUsernameFlag, setInvalidUsernameFlag] = useState(false);
  const [weakNewPasswordFlag, setWeakNewPasswordFlag] = useState(false);
  const [sameNewOldPasswordFlag, setSameNewOldPasswordFlag] = useState(false);
  const [diffNewAndConfirmPasswordFlag, setDiffNewAndConfirmPasswordFlag] =
    useState(false);
  const [wrongPasswordFlag, setWrongPasswordFlag] = useState(false);
  const [exceedPasswordResetFlag, setExceedPasswordResetFlag] = useState(false);

  const userController = useMemo(() => new UserController(), []);

  const resetAllFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setNewUsername("");
    setMessage("");
    setInvalidUsernameFlag(false);
    setWeakNewPasswordFlag(false);
    setDiffNewAndConfirmPasswordFlag(false);
    setSameNewOldPasswordFlag(false);
    setWrongPasswordFlag(false);
    setExceedPasswordResetFlag(false);
  };

  const closeAllForms = () => {
    setUsernameChangeFormOpen(false);
    setPasswordChangeFormOpen(false);
  };

  const tabs: TabItem[] = [
    {
      name: "Home",
      onClick: () => {
        resetAllFields();
        closeAllForms();
      },
      current: !isPasswordChangeFormOpen && !isUsernameChangeFormOpen,
    },
    {
      name: "Update Username",
      onClick: () => {
        resetAllFields();
        closeAllForms();
        setUsernameChangeFormOpen(true);
      },
      current: isUsernameChangeFormOpen,
    },
    {
      name: "Change Password",
      onClick: () => {
        resetAllFields();
        closeAllForms();
        setPasswordChangeFormOpen(true);
      },
      current: isPasswordChangeFormOpen,
    },
  ];

  const passwordErrorTabs: ErrorTabItem[] = [
    { flag: weakNewPasswordFlag, statement: "Weak password used" },
    {
      flag: sameNewOldPasswordFlag,
      statement: "Same new and old password used",
    },
    {
      flag: diffNewAndConfirmPasswordFlag,
      statement: "Different new and confirm password",
    },
    {
      flag: wrongPasswordFlag,
      statement: "Wrong old password",
    },
    {
      flag: exceedPasswordResetFlag,
      statement: "Too many password reset attempts, try again later",
    },
  ];

  const { updateThePassword, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailProp !== null) {
      setEmail(emailProp);
    }
    if (usernameProp !== null) {
      setUsername(usernameProp);
    }
    if (!isOpen) {
      setMessage("");
      setInvalidUsernameFlag(false);
      setWeakNewPasswordFlag(false);
      setDiffNewAndConfirmPasswordFlag(false);
      setSameNewOldPasswordFlag(false);
      setWrongPasswordFlag(false);
      setExceedPasswordResetFlag(false);
    }
  }, [emailProp, usernameProp, isOpen]);

  const handlePasswordChange = async () => {
    try {
      setMessage("");
      setWeakNewPasswordFlag(false);
      setDiffNewAndConfirmPasswordFlag(false);
      setSameNewOldPasswordFlag(false);
      setWrongPasswordFlag(false);
      setExceedPasswordResetFlag(false);
      setIsLoading(true);

      if (newPassword !== confirmNewPassword) {
        // setMessage("New passwords do not match.");
        setDiffNewAndConfirmPasswordFlag(true);
        return;
      }

      if (oldPassword === newPassword) {
        // setMessage("The same old password and new password have been entered");
        setSameNewOldPasswordFlag(true);
        return;
      }

      const credential = EmailAuthProvider.credential(email, oldPassword);

      // If reauthentication is successful, update the password
      if (currentUser) {
        await reauthenticateWithCredential(currentUser, credential).then(() =>
          updateThePassword(newPassword),
        );
      }

      setPasswordChangeFormOpen(false);
      // setMessage("");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage("Password changed successfully!");
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error instanceof FirebaseError) {
        console.error(error.code);
        switch (error.code) {
          case "auth/weak-password":
            setWeakNewPasswordFlag(true);
            break;

          case "auth/invalid-login-credentials":
            setWrongPasswordFlag(true);
            break;

          case "auth/too-many-requests":
            setExceedPasswordResetFlag(true);
            break;

          // case "auth/user-not-found":
          //   setNoUserFlag(true);
          //   break;

          default:
            break;
        }
      } else if (error && error.message) {
        if (error.message === "Current user is not defined") {
          navigate(`/`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = async () => {
    try {
      setMessage("");
      setIsLoading(true);

      if (newUsername === username) {
        // setMessage("New Username same as old Username.");
        setInvalidUsernameFlag(true);
        return;
      }

      if (newUsername.trim() === "") {
        // setMessage("The new Username is invalid");
        setInvalidUsernameFlag(true);
        return;
      }

      const res = await userController.updateUser(userId, {
        username: newUsername,
      });

      if (res.status !== 200) {
        // Username change failed
        console.error("Failed to change username:", res.data);
        setMessage("Failed to change username, do try again");
        return;
      }

      setUsernameChangeFormOpen(false);
      setUsernameCallback(newUsername);
      setNewUsername("");
      setMessage("Username changed successfully!");
    } catch (error: any) {
      console.error("Error changing usernmae:", error);
      setMessage(`Error changing username: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl xl:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Update account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed from our servers
                        forever. This action cannot be undone.
                      </p>
                    </div>
                    <div className="sm:hidden">
                      {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                      <label htmlFor="tabsSelect" className="sr-only">
                        Select a tab
                        <select
                          id="tabsSelect"
                          name="tabs"
                          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          defaultValue={
                            tabs.find((tab) => tab.current)
                              ? tabs.find((tab) => tab.current)!.name
                              : tabs[0].name
                          }
                        >
                          {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="hidden sm:block">
                      <div className="border-b border-gray-200">
                        <nav
                          className="-mb-px flex space-x-8"
                          aria-label="Tabs"
                        >
                          {tabs.map((tab) => (
                            <button
                              type="button"
                              key={tab.name}
                              className={classNames(
                                tab.current
                                  ? "border-indigo-500 text-indigo-600"
                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                              )}
                              onClick={tab.onClick}
                              aria-current={tab.current ? "page" : undefined}
                            >
                              {tab.name}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <div className="mt-2">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="email" className={styles.formLabel}>
                            Email
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={email}
                              disabled
                            />
                          </label>
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="username"
                            className={styles.formLabel}
                          >
                            Username
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              value={username}
                              disabled
                            />
                          </label>
                        </div>
                      </form>
                      {isPasswordChangeFormOpen && (
                        <form>
                          <div className="mb-3">
                            <label
                              htmlFor="oldPassword"
                              className={styles.formLabel}
                            >
                              Old Password
                              <input
                                type="password"
                                className="form-control"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </label>
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="newPassword"
                              className={styles.formLabel}
                            >
                              New Password
                              <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </label>
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="confirmNewPassword"
                              className={styles.formLabel}
                            >
                              Confirm New Password
                              <input
                                type="password"
                                className={classNames(
                                  "form-control",
                                  passwordErrorTabs.some((tab) => tab.flag)
                                    ? "ring-red-300 dark:ring-red-700"
                                    : "ring-gray-300 dark:ring-gray-700",
                                )}
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                  setConfirmNewPassword(e.target.value)
                                }
                                aria-invalid={passwordErrorTabs.some(
                                  (tab) => tab.flag,
                                )}
                                aria-describedby="new-password-error"
                              />
                            </label>
                          </div>
                          {passwordErrorTabs.some((tab) => tab.flag) && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="new-password-error"
                            >
                              {
                                passwordErrorTabs.find((tab) => tab.flag)
                                  ?.statement
                              }
                            </p>
                          )}
                          <div className="flex flex-row gap-2 justify-end">
                            <button
                              type="button"
                              onClick={handlePasswordChange}
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                              disabled={isLoading}
                            >
                              Confirm Change Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPasswordChangeFormOpen(false);
                                setMessage("");
                              }}
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              disabled={isLoading}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      {isUsernameChangeFormOpen && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <div className="mb-3">
                            <label
                              htmlFor="newUsername"
                              className={styles.formLabel}
                            >
                              New Username
                              <input
                                type="text"
                                className={classNames(
                                  "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                                  "focus:ring-indigo-600 dark:focus:ring-indigo-400",
                                  invalidUsernameFlag
                                    ? "ring-red-300 dark:ring-red-700"
                                    : "ring-gray-300 dark:ring-gray-700",
                                )}
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                aria-invalid={invalidUsernameFlag}
                                aria-describedby="username-error"
                              />
                            </label>
                          </div>
                          {invalidUsernameFlag && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="username-error"
                            >
                              An invalid username is used
                            </p>
                          )}
                          <div className="flex flex-row gap-2 justify-end">
                            <button
                              type="button"
                              onClick={handleUsernameChange}
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                              disabled={isLoading}
                            >
                              Confirm Change Username
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUsernameChangeFormOpen(false);
                                setInvalidUsernameFlag(false);
                                setMessage("");
                              }}
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              disabled={isLoading}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      {message && <p className="text">{message}</p>}
                    </div>
                  </div>
                </div>
                {/* <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    disabled={isLoading}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
