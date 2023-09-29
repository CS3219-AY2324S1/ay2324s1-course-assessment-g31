import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FirebaseError } from "@firebase/app";
import { useNavigate } from "react-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "@firebase/auth";
import styles from "./UpdateProfileModal.module.css";
import { useAuth } from "../../../context/AuthContext";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: (username: string, email: string) => void;
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
  const [email, setEmail] = useState(emailProp || "");
  const [username, setUsername] = useState(usernameProp || "");
  const [isPasswordChangeFormOpen, setPasswordChangeFormOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameChangeFormOpen, setUsernameChangeFormOpen] = useState(false);
  const [isEmailChangeFormOpen, setEmailChangeFormOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordNewEmail, setPasswordNewEmail] = useState("");

  const { updateThePassword, verifyBeforeTheEmailUpdate, currentUser, logout } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailProp !== null) {
      setEmail(emailProp);
    }
    if (usernameProp !== null) {
      setUsername(usernameProp);
    }
    if (!isOpen) {
      setMessage("");
    }
  }, [emailProp, usernameProp, isOpen]);

  const handleLogout = () => {
    logout()
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        setMessage(`Error, ${error}`);
      });
  };

  const handlePasswordChange = async () => {
    try {
      setMessage("");
      setIsLoading(true);

      if (newPassword !== confirmNewPassword) {
        setMessage("New passwords do not match.");
        return;
      }

      if (oldPassword === newPassword) {
        setMessage("The same old password and new password have been entered");
        return;
      }

      const credential = EmailAuthProvider.credential(email, oldPassword);

      if (currentUser) {
        await reauthenticateWithCredential(currentUser, credential).then(() => {
          // If reauthentication is successful, update the password
          return updateThePassword(newPassword);
        });
      }

      setPasswordChangeFormOpen(false);
      setMessage("");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage("Password changed successfully!");
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error instanceof FirebaseError) {
        setMessage(error.code);
      } else if (error && error.message) {
        if (error.message === "Current user is not defined") {
          navigate(`/`);
        } else {
          setMessage(error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = async () => {
    try {
      setMessage("");
      setIsLoading(true);

      if (newUsername === username) {
        setMessage("New Username same as old Username.");
        return;
      }

      if (newUsername.trim() === "") {
        setMessage("The new Username is invalid");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/user-services/change-username/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newUsername,
          }),
        },
      );

      if (!res.ok) {
        // Username change failed
        const data = await res.json();
        console.error("Failed to change username:", data.message);
        setMessage("Failed to change username, do try again");
        return;
      }

      setUsernameChangeFormOpen(false);
      setMessage("");
      setUsername(newUsername);
      setNewUsername("");
      setMessage("Username changed successfully!");
    } catch (error: any) {
      console.error("Error changing usernmae:", error);
      setMessage(`Error changing username: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async () => {
    try {
      setMessage("");
      setIsLoading(true);

      if (newEmail === email) {
        setMessage("The email is the same");
        return;
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

      if (newEmail.trim() === "" || !emailRegex.test(newEmail)) {
        setMessage("The new email is invalid");
        return;
      }

      if (passwordNewEmail.trim() === "") {
        setMessage("The email is the same");
        return;
      }

      const credential = EmailAuthProvider.credential(email, passwordNewEmail);

      console.log(currentUser);

      if (currentUser) {
        await reauthenticateWithCredential(currentUser, credential);
        await verifyBeforeTheEmailUpdate(newEmail);
        setTimeout(handleLogout, 3000);
      }

      setEmailChangeFormOpen(false);
      setMessage("");
      setEmail(newEmail);
      setNewEmail("");
      setPasswordNewEmail("");
      setMessage(
        "If new email is not already registered, you will receive a verification link in your new email. Click on it and login with new email.",
      );
      setTimeout(handleLogout, 8500);
    } catch (error: any) {
      console.error("Error changing email:", error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-login-credentials") {
          setMessage("Wrong password provided");
        } else {
          setMessage(error.code);
        }
      } else if (error.message === "Current user is not defined") {
        navigate(`/`);
      } else {
        setMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setEmailChangeFormOpen(false);
        setPasswordChangeFormOpen(false);
        setUsernameChangeFormOpen(false);
        onClose(username, email);
      }}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.updateProfileCard}>
        <h2>Update Profile {currentUser?.email}</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className={styles.formLabel}>
              Email
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                disabled
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
                disabled
              />
            </label>
          </div>
          <div className={styles.modalButtons}>
            <button
              type="button"
              onClick={() => {
                setPasswordChangeFormOpen(false);
                setUsernameChangeFormOpen(false);
                setEmailChangeFormOpen(true);
                setMessage("");
              }}
              className="btn btn-primary"
            >
              Update Email
            </button>
            <button
              type="button"
              onClick={() => {
                setPasswordChangeFormOpen(false);
                setUsernameChangeFormOpen(true);
                setEmailChangeFormOpen(false);
                setMessage("");
              }}
              className="btn btn-primary"
            >
              Update Username
            </button>
            <button
              type="button"
              onClick={() => {
                setPasswordChangeFormOpen(true);
                setUsernameChangeFormOpen(false);
                setEmailChangeFormOpen(false);
                setMessage("");
              }}
              className="btn btn-secondary"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={() => {
                setUsernameChangeFormOpen(false);
                setPasswordChangeFormOpen(false);
                setEmailChangeFormOpen(false);
                onClose(username, email);
              }}
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
                disabled={isLoading}
              >
                Confirm Change Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordChangeFormOpen(false);
                  setMessage("");
                }}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {isEmailChangeFormOpen && (
          <form>
            <br />
            <div className="mb-3">
              <label htmlFor="newEmail" className={styles.formLabel}>
                New Email
                <input
                  type="email"
                  className="form-control"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="passwordNewEmail" className={styles.formLabel}>
                Password for Confirmation
                <input
                  type="password"
                  className="form-control"
                  id="passwordNewEmail"
                  value={passwordNewEmail}
                  onChange={(e) => setPasswordNewEmail(e.target.value)}
                />
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handleEmailChange}
                className="btn btn-primary"
                disabled={isLoading}
              >
                Confirm Change Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailChangeFormOpen(false);
                  setMessage("");
                }}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {isUsernameChangeFormOpen && (
          <form>
            <br />
            <div className="mb-3">
              <label htmlFor="newUsername" className={styles.formLabel}>
                New Username
                <input
                  type="username"
                  className="form-control"
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handleUsernameChange}
                className="btn btn-primary"
                disabled={isLoading}
              >
                Confirm Change Username
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsernameChangeFormOpen(false);
                  setMessage("");
                }}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {message && <p className="text">{message}</p>}
      </div>
    </Modal>
  );
}
