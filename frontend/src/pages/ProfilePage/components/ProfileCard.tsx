import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import UserController from "../../../controllers/user/user.controller";
import DeleteProfileModal from "./DeleteProfileModal";
import styles from "./ProfileCard.module.css";
import UpdateProfileModal from "./UpdateProfileModal";

export default function ProfileCard() {
  const { currentUser } = useAuth();

  const userController = useMemo(() => new UserController(), []);

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

  const openUpdateProfileModal = () => {
    setIsUpdateProfileModalOpen(true);
  };

  const setUsernameCallback = (username: string) => {
    setProfileData({ ...profileData, username });
  };

  //   const closeUpdateProfileModal = (username: string, email: string) => {
  //     setIsUpdateProfileModalOpen(false);
  //     setProfileData({
  //       username,
  //       email,
  //     });
  //   };

  //   const openDeleteProfileModal = () => {
  //     setIsDeleteProfileModalOpen(true);
  //   };

  //   const closeDeleteProfileModal = () => {
  //     setIsDeleteProfileModalOpen(false);
  //   };

  const fetchProfileData = useCallback(async () => {
    try {
      // Check if firebase has this user
      if (currentUser !== null) {
        const res = await userController.getUser(currentUser.uid);
        // const response = await fetch(
        //   `http://localhost:5001/user-services/profile/${userId}`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   },
        // );

        // const data = await response.json();

        if (!res || !res.data) {
          console.error("Failed to fetch profile: ", res.statusText);

          setMessage(`Error fetching profile data: ${res.statusText}`);
        } else {
          console.log("Successfully fetched username: ", res.data.username);
          setProfileData({
            username: res.data.username,
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
  }, [currentUser, userController]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return (
    <div className="bg-gray-400/5 m-5 rounded">
      <div className={styles.profileCardCard}>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={openUpdateProfileModal}
            disabled={disableUpdateProfileModal}
          >
            Update Account
          </button>
          <button
            type="button"
            className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={() => setIsDeleteProfileModalOpen(true)}
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
      {currentUser && (
        <>
          <DeleteProfileModal
            isOpen={isDeleteProfileModalOpen}
            setOpen={setIsDeleteProfileModalOpen}
          />
          <UpdateProfileModal
            isOpen={isUpdateProfileModalOpen}
            setOpen={setIsUpdateProfileModalOpen}
            userId={currentUser.uid}
            emailProp={profileData.email}
            usernameProp={profileData.username}
            setUsernameCallback={setUsernameCallback}
          />
        </>
      )}
    </div>
  );
}
