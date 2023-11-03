import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteProfileModal from "./DeleteProfileModal";
import UpdateProfileModal from "./UpdateProfileModal";
import styles from "./ProfileCard.module.css";
import { useAuth } from "../../../context/AuthContext";

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
    logout()
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        setMessage(`Error, ${error.message}`);
      });
  };

  const openUpdateProfileModal = () => {
    setIsUpdateProfileModalOpen(true);
  };

  const closeUpdateProfileModal = (username: string, email: string) => {
    setIsUpdateProfileModalOpen(false);
    setProfileData({
      username,
      email,
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
      const idToken = await currentUser?.getIdToken();
      try {
        // Check if firebase has this user
        if (currentUser !== null) {
          const response = await fetch(
            `http://localhost:3000/user-services/profile/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
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
