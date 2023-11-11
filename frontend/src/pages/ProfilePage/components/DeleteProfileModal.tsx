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
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import UserController from "../../../controllers/user/user.controller";

interface DeleteProfileModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  userId: string | null;
}

export default function DeleteProfileModal({
  isOpen,
  setOpen,
  userId,
}: DeleteProfileModalProps) {
  const navigate = useNavigate();
  const { currentUser, deleteTheUser } = useAuth();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setPassword("");
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const userController = useMemo(() => new UserController(), []);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (currentUser) {
        const credential = EmailAuthProvider.credential(
          currentUser.email ? currentUser.email : "",
          password,
        );

        await reauthenticateWithCredential(currentUser, credential);
        // If reauthentication is successful, delete user from firebase
        await deleteTheUser();
        const res = await userController.deleteUser(currentUser.uid);

        if (res.status !== 200) {
          // Account deletion from psql failed
          console.error("Failed to delete account from psql:", res.statusText);
        }
        navigate(`/`);
      }
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        setMessage(error.code);
      } else if (error && error.message) {
        if (error.message === "Current user is not defined") {
          navigate(`/`);
        } else {
          setMessage(error.message);
        }
      }
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Delete account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed from our servers
                        forever. This action cannot be undone.
                      </p>
                    </div>
                    <div className="mt-2">
                      <form onSubmit={handleDeleteAccount}>
                        <div>
                          <p className="text-sm text-gray-500">
                            Enter password to confirm account deletion
                          </p>
                          <div>
                            <label htmlFor="password">
                              <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleInputChange}
                                required
                              />
                            </label>
                          </div>
                          {message && <p className="text">{message}</p>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
