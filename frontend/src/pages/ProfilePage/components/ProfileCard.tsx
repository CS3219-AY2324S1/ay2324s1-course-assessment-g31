import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteProfileModal from "./DeleteProfileModal";
import UpdateProfileModal from "./UpdateProfileModal";
import styles from "./ProfileCard.module.css";
import database from "../../../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "../../../context/AuthContext";
// import { FirebaseError } from "firebase/app";

export default function ProfileCard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [disableUpdateProfileModal, setDisableUpdateProfileModal] =
    useState(true);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState(false);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);

  const handleLogout = () => {
    // TODO: Perform logout actions here (e.g., clearing user session)
    logout()
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        setMessage("Error, " + error);
      });
  };

  const openUpdateProfileModal = () => {
    setIsUpdateProfileModalOpen(true);
  };

  const closeUpdateProfileModal = (username: string, email: string) => {
    setIsUpdateProfileModalOpen(false);
    setProfileData({
      username: username,
      email: email,
    });
  };

  const openDeleteProfileModal = () => {
    setIsDeleteProfileModalOpen(true);
  };

  const closeDeleteProfileModal = () => {
    setIsDeleteProfileModalOpen(false);
  };

  useEffect(() => {
    async function fetchProfileData() {
      try {
        // const user = database.currentUser;

        // Check if firebase has this user
        if (currentUser !== null) {
          // Check if postgres has this user
          // const response = await fetch(
          //   `http://localhost:3000/user-services/profile/${userId}`,
          //   {
          //     method: "GET",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //   },
          // );

          // const data = await response.json();

          // if psql no user, register the user
          // if (!response.ok) {

          //   console.error("Failed to fetch profile:", data.message);
          // } else {
          //   console.log("Successfully fetched profile: ", data);
          //   setProfileData(data);
          // }
          // console.log("user id: " + user.uid);
          // console.log("Successfully fetched profile: ", data);

          const response = await fetch(
            `http://localhost:3000/user-services/profile/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const data = await response.json();

          if (!response.ok) {
            console.error("Failed to fetch profile:", data.message);

            setMessage(`Error fetching profile data: ${data.message}`);
          } else {
            console.log("Successfully fetched username: ", data);
            setProfileData({
              ...profileData,
              username: data.username,
              email: currentUser.email ? currentUser.email : "",
            });
            setMessage("Profile fetched successfully");
            setDisableUpdateProfileModal(false);
          }
        } else {
          console.log("Unauthenticated access");
          setMessage("Unauthenticated user access");
        }
      } catch (error: any) {
        console.log("Error fetching profile data:", error.message);
        setMessage(`Error fetching profile data ${error.message}`);
      }
    }

    fetchProfileData();
  }, [userId, currentUser]);

  return (
    <div className={styles.profileCardContainer}>
      <div className={styles.profileCardCard}>
        <div className={styles.publicButtons}>
          <button
            type="button"
            className={styles.updateProfileButton}
            onClick={openUpdateProfileModal}
            disabled={disableUpdateProfileModal}
          >
            Update Account
          </button>
          <button
            type="button"
            className={styles.deleteProfileButton}
            onClick={openDeleteProfileModal}
          >
            Delete Account
          </button>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
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
        isOpen={isDeleteProfileModalOpen}
        onClose={closeDeleteProfileModal}
        userId={userId}
      />
      <UpdateProfileModal
        isOpen={isUpdateProfileModalOpen}
        onClose={closeUpdateProfileModal}
        userId={userId}
        emailProp={profileData.email}
        usernameProp={profileData.username}
      />
    </div>
  );
}
