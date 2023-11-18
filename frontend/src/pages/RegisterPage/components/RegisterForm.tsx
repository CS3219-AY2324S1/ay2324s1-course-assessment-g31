import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(""); // New state for generic message
  const navigate = useNavigate(); // Initialize navigate

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
      // Add password and confirm password check
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/user-services/register`,
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
        console.error("Registration error:", data.message);
        setMessage(`Error: ${data.message}`);
      } else {
        console.log("Successfully registered:", formData);
        setMessage("Successfully registered"); // Set the success message
        navigate("/user/login"); // Navigate to the login page
      }
    } catch (err: any) {
      console.error("Network error:", err.message);
      setMessage(`Network error: ${err.message}`);
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
          <button type="submit">Register</button>
          {message && <p>{message}</p>}
        </div>
        <p>
          Already have an account?<Link to="/user/login"> Login</Link>
        </p>
      </form>
    </div>
  );
}
