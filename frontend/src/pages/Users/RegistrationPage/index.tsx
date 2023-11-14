import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "@firebase/util";
import { useAuth } from "../../../context/AuthContext";
import { UserCreateDTO } from "../../../interfaces/userService/createDTO";
import UserController from "../../../controllers/user/user.controller";

function RegistrationPage() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const userController = useMemo(() => new UserController(), []);
  const { signUp } = useAuth();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     // Send the email and password to firebase
  //     const userCredential = await registerUser(email, password);

  //     if (userCredential) {
  //       navigate("/profile");
  //     }
  //   } catch (error: any) {
  //     setMessage(error.message);
  //     throw new Error(error);
  //   }
  // };

  const handleSubmit = async () => {
    // setIsLoading(true);

    if (password !== password2) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      let dataUID = "";
      await signUp(email, password).then((data) => {
        if (data) {
          console.log(data, "authData");
          dataUID = data.user.uid;
        }
      });

      const newUser: UserCreateDTO = {
        id: dataUID,
        username,
        roles: ["user"],
      };

      const res = await userController.createUser(newUser);

      if (!res || !res.data) {
        console.log(
          "Registration failed on user-service backend: ",
          res.statusText,
        );
      } else {
        console.log("Successfully resgistered: ", res.data);
      }
      navigate(`/questions`);
    } catch (err: any) {
      if (err instanceof FirebaseError) {
        setMessage(`Error ${err.code}`);
        console.error(`Error ${err.message}`);
      } else {
        console.error("Network error: ", err.message);
        setMessage(`Network error: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-10 w-auto" src="/logo.png" alt="Peer Prep Logo" />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
              Register for account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Log In
              </Link>
            </p>
          </div>

          <div className="mt-10">
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
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="username"
                      autoComplete="username"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
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
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password2"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password2"
                      name="password2"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleSubmit}
                  >
                    Register
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="relative flex justify-center text-sm font-medium leading-6"
                  >
                    {message}
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/coding-2.jpeg"
          alt="Man Coding"
        />
      </div>
    </div>
  );
}

export default RegistrationPage;
