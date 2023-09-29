import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { useAuth } from "../../../context/AuthContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    userid: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    setIsLoading(true);

    await login(formData.email, formData.password)
      .then((data) => {
        if (data) {
          console.log(data, "authData");
          setMessage("Successfully logged in");
          navigate(`/questions`);
        }
      })
      .catch((err) => {
        console.log(err.code);
        setMessage(`${err.code}`);
      });
    setIsLoading(false);
  };

  return (
    <div className={styles.loginFormContainer}>
      <h2>Login Form</h2>
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
        <div className={styles.loginSubmitButton}>
          <button disabled={isLoading} type="submit">
            Login
          </button>
          {message && <p>{message}</p>}
        </div>
        <p>
          No account?<Link to="/register"> Register</Link>
        </p>
      </form>
    </div>
  );
}
