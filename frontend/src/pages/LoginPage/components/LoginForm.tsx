import React, { useState } from "react";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // New state for generic message

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
    try {
      const response = await fetch(
        `http://localhost:3000/user-services/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Login error:", data.message);
        setMessage(`${data.message}`);
      } else {
        console.log("Successfully logged in:", formData);
        setMessage("Successfully logged in"); // Set the success message
      }
    } catch (err: any) {
      console.error("Network error:", err.message);
      setMessage(`Network error: ${err.message}`);
    }
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
          <button type="submit">Login</button>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
}
