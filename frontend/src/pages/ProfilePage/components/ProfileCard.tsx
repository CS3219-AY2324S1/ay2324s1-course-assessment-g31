import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteProfileModal from "./DeleteProfileModal";
import styles from "./ProfileCard.module.css";

export default function ProfileCard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    hashedPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Perform logout actions here (e.g., clearing user session)
    navigate("/login");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch(
          `http://localhost:3000/user-services/profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          },
        );
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          console.error("Failed to fetch profile:", data.message);
        } else {
          console.log("Successfully fetched profile: ", data);
          setProfileData(data);
        }
      } catch (error: any) {
        console.log("Error fetching profile data:", error.message);
        setMessage(`Error fetching profile data ${error.message}`);
      }
    }

    fetchProfileData();
  }, [userId]);

  return (
    <div className={styles.profileCardContainer}>
      <div className={styles.profileCardCard}>
        <div className={styles.publicButtons}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            type="button"
            className={styles.deleteProfileButton}
            onClick={openModal}
          >
            Delete Account
          </button>
        </div>
        <h2>Profile Card</h2>
        <div>
          <h4>Username</h4>
          <p className={styles.profileCardInput}>{profileData.username}</p>
        </div>
        <div>
          <h4>Email</h4>
          <p className={styles.profileCardInput}>{profileData.email}</p>
        </div>
        {message && <p>{message}</p>}
      </div>
      <DeleteProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userId={userId}
      />
    </div>
  );
}
