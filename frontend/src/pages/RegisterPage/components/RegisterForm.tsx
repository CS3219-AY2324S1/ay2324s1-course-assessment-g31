import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import styles from "./RegisterForm.module.css";
import database from "../../../../FirebaseConfig";
import { FirebaseError } from "@firebase/util";
import { useAuth } from "../../../context/AuthContext";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    userid: "", // this value shldnt be updated in any case
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    user_role: "User",
  });

  const { signup } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted with data:", formData);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      let dataUID = "";
      await signup(formData.email, formData.password).then((data) => {
        if (data) {
          console.log(data, "authData");
          setFormData({
            ...formData,
            userid: data.user.uid,
          });
          dataUID = data.user.uid;
        }
      });

      const response = await fetch(
        `http://localhost:3000/user-services/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: dataUID,
            username: formData.username,
            user_role: formData.user_role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Registration failed on postgresql:", data.message);
      }
      console.log("Successfully registered:", formData);
      navigate(`/questions`);
    } catch (err: any) {
      if (err instanceof FirebaseError) {
        setMessage("Error " + err.code);
        console.error("Error " + err.message);
      } else {
        console.error("Network error: ", err.message);
        setMessage("Network error: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerFormContainer}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div>Email</div>
          <label htmlFor="email">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <div>Username</div>
          <label htmlFor="username">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <div>Password</div>
          <label htmlFor="password">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <div>Confirm Password</div>
          <label htmlFor="confirmPassword">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div className={styles.registerSubmitButton}>
          <button disabled={isLoading} type="submit">
            Register
          </button>
          {message && <p>{message}</p>}
        </div>
        <p>
          Already have an account?<Link to="/"> Login</Link>
        </p>
      </form>
    </div>
  );
}
