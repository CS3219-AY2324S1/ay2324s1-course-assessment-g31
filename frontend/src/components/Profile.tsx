import { CheckCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserController from "../controllers/user/user.controller";
import { changeEmail, changePassword, removeUser } from "../util/auth";
import Toast from "./Toast";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const [name, setName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showUpdateProfileToast, setShowUpdateProfileToast] =
    useState<boolean>(false);

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const userController = new UserController();

  React.useEffect(() => {
    if (!currentUser) {
      return;
    }

    console.log(currentUser);

    setEmailAddress(currentUser.email!);
    setName(currentUser.displayName ? currentUser.displayName : "Anonymous");
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!currentUser) {
      return;
    }

    if (!emailAddress) {
      return;
    }

    userController
      .updateUser(currentUser.uid, {
        username: name,
      })
      .then(() => {
        // setName(res.name);
        setShowUpdateProfileToast(true);
      });

    if (currentUser.email !== emailAddress) {
      changeEmail(currentUser, emailAddress);
    }
  };

  const handleChangePassword = async (
  ) => {
    if (!currentUser) {
      return;
    }

    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return;
    }

    changePassword(currentUser, newPassword);
  };

  const handleDeleteAccount = async (
  ) => {
    if (!currentUser) {
      return;
    }

    userController.deleteUser(currentUser.uid);
    removeUser(currentUser);

    navigate("/");
  };

  return (
    <>
      {showUpdateProfileToast && (
        <Toast
          icon={
            <CheckCircleIcon
              className="h-6 w-6 text-green-400"
              aria-hidden="true"
            />
          }
          title="Successfully updated!"
          description="Your profile has been updated successfully."
        />
      )}

      {/* Settings forms */}
      <div className="divide-y divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Use a permanent address where you can receive mail.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              {/* <div className="col-span-full flex items-center gap-x-8">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                />
                <div>
                  <button
                    type="button"
                    className="rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change avatar
                  </button>
                  <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div> */}

              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div> */}

              <div className="col-span-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-gray-200 dark:text-gray-50 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleUpdateProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              Change password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Update your password associated with your account.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Current password
                </label>
                <div className="mt-2">
                  <input
                    id="current-password"
                    name="current_password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  New password
                </label>
                <div className="mt-2">
                  <input
                    id="new-password"
                    name="new_password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-gray-200 dark:text-gray-50 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleChangePassword}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              Log out other sessions
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Please enter your password to confirm you would like to log out of
              your other sessions across all of your devices.
            </p>
          </div>

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="logout-password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Your password
                </label>
                <div className="mt-2">
                  <input
                    id="logout-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-gray-200 dark:text-gray-50 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Log out other sessions
              </button>
            </div>
          </form>
        </div> */}

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
              Delete account
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>

          <div className="flex items-start md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-gray-200 dark:text-gray-50 shadow-sm hover:bg-red-400"
              onClick={handleDeleteAccount}
            >
              Yes, delete my account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
