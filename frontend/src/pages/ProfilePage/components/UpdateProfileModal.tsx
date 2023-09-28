import { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./UpdateProfileModal.module.css";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  emailProp: string | null;
  usernameProp: string | null;
}

export default function UpdateProfileModal({
  isOpen,
  onClose,
  userId,
  emailProp,
  usernameProp,
}: UpdateProfileModalProps) {
  console.log(emailProp);
  console.log(usernameProp);
  const [email, setEmail] = useState(emailProp || "");
  const [username, setUsername] = useState(usernameProp || "");
  const [isPasswordChangeFormOpen, setPasswordChangeFormOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (emailProp !== null) {
      setEmail(emailProp);
    }
    if (usernameProp !== null) {
      setUsername(usernameProp);
    }
  }, [emailProp, usernameProp]);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user-services/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
          }),
        },
      );

      if (response.ok) {
        console.log("Successfully updated profile!");
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        // Update failed
        const data = await response.json();
        console.error("Failed to update profile:", data.message);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        setMessage("New passwords do not match.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/user-services/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
      );

      if (response.ok) {
        console.log("Password changed successfully!");
        setPasswordChangeFormOpen(false);
        setMessage("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setSuccessMessage("Password changed successfully");
      } else {
        // Password change failed
        const data = await response.json();
        console.error("Failed to change password:", data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.updateProfileCard}>
        <h2>Update Profile</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className={styles.formLabel}>
              Email
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="username" className={styles.formLabel}>
              Username
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div className={styles.modalButtons}>
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="btn btn-primary"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setPasswordChangeFormOpen(true)}
              className="btn btn-secondary"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
        {isPasswordChangeFormOpen && (
          <form>
            <div className="mb-3">
              <label htmlFor="oldPassword" className={styles.formLabel}>
                Old Password
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className={styles.formLabel}>
                New Password
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmNewPassword" className={styles.formLabel}>
                Confirm New Password
                <input
                  type="password"
                  className="form-control"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handlePasswordChange}
                className="btn btn-primary"
              >
                Confirm Change Password
              </button>
              <button
                type="button"
                onClick={() => setPasswordChangeFormOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {message && <p className="text-danger">{message}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
      </div>
    </Modal>
  );
}
