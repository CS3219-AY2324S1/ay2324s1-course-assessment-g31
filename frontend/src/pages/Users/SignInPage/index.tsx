import { FirebaseError } from "@firebase/util";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { NotificationContext } from "../../../context/NotificationContext";
import UserController from "../../../controllers/user/user.controller";
import classNames from "../../../util/ClassNames";

function SignInPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [wrongPasswordFlag, setWrongPasswordFlag] = useState<boolean>(false);
  const [noUserFlag, setNoUserFlag] = useState<boolean>(false);

  const [noUserOrWrongPasswordFlag, setNoUserOrWrongPasswordFlag] =
    useState<boolean>(false);
  const userController = new UserController();
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const { login } = useAuth();
  const handleSubmit = async () => {
    console.log("Form submitted with data");
    setLoading(true);
    setWrongPasswordFlag(false);
    setNoUserFlag(false);
    try {
      // Send the email and password to firebase
      const userCredential = await login(email, password);
      if (userCredential) {
        userController
          .getUser(userCredential.user.uid)
          .then(() => navigate("/"))
          .catch(() => {
            addNotification({
              type: "error",
              message: "There was an error in connecting to the user service",
            });
          });
      }
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error(err.code);
        switch (err.code) {
          case "auth/wrong-password":
            setWrongPasswordFlag(true);
            break;

          case "auth/invalid-login-credentials":
            setNoUserOrWrongPasswordFlag(true);
            break;

          case "auth/user-not-found":
            setNoUserFlag(true);
            break;

          default:
            break;
        }
      }
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setWrongPasswordFlag(false);
  //   setNoUserFlag(false);
  //   try {
  //     // Send the email and password to firebase
  //     const userCredential = await signInUser(email, password);
  //     if (userCredential) {
  //       userController
  //         .getUser(userCredential.user.uid)
  //         .then(() => navigate("/"))
  //         .catch(() => {
  //           addNotification({
  //             type: "error",
  //             message: "There was an error in connecting to the user service",
  //           });
  //         });
  //     }
  //     setLoading(false);
  //   } catch (err: unknown) {
  //     if (err instanceof FirebaseError) {
  //       console.error(err.code);
  //       switch (err.code) {
  //         case "auth/wrong-password":
  //           setWrongPasswordFlag(true);
  //           break;

  //         case "auth/user-not-found":
  //           setNoUserFlag(true);
  //           break;

  //         default:
  //           break;
  //       }
  //       setLoading(false);
  //     }
  //   }
  // };

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-10 w-auto" src="/logo.png" alt="Peer Prep Logo" />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Not a member?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Register for an account
              </Link>
            </p>
          </div>

          <div className="my-10">
            <div>
              <div className="space-y-6">
                <div>
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
                      required
                      className={classNames(
                        "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        "focus:ring-indigo-600 dark:focus:ring-indigo-400",
                        noUserFlag || noUserOrWrongPasswordFlag
                          ? "ring-red-300 dark:ring-red-700"
                          : "ring-gray-300 dark:ring-gray-700",
                      )}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="sign-in-page-email-input"
                      aria-invalid={noUserFlag}
                      aria-describedby="user-error"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  {noUserFlag && (
                    <p className="mt-2 text-sm text-red-600" id="user-error">
                      No User Exists
                    </p>
                  )}
                  {noUserOrWrongPasswordFlag && (
                    <p className="mt-2 text-sm text-red-600" id="user-error">
                      Invalid Username or Password
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={classNames(
                        "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        "focus:ring-indigo-600 dark:focus:ring-indigo-400",
                        wrongPasswordFlag
                          ? "ring-red-300 dark:ring-red-700"
                          : "ring-gray-300 dark:ring-gray-700",
                      )}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-testid="sign-in-page-password-input"
                      aria-invalid={wrongPasswordFlag}
                      aria-describedby="password-error"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  {wrongPasswordFlag && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="password-error"
                    >
                      Wrong Password
                    </p>
                  )}
                </div>

                <div>
                  <button
                    name="sign-in"
                    type="button"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-100 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={loading}
                    data-testid="sign-in-page-sign-in-button"
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
                          viewBox="0 0 24 24"
                        />
                        Processing
                      </>
                    ) : (
                      <p>Sign in</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/coding-1.jpeg"
          alt="Woman Coding"
        />
      </div>
    </div>
  );
}

export default SignInPage;
