import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "@firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "@firebase/auth";
import styles from "./DeleteProfileModal.module.css"; // Create a CSS module for modal styles
import { useAuth } from "../../../context/AuthContext";

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function DeleteProfileModal({
  isOpen,
  onClose,
  userId,
}: DeleteProfileModalProps) {
  const navigate = useNavigate();
  const { currentUser, deleteTheUser } = useAuth();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setPassword("");
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    const idToken = await currentUser?.getIdToken();
    try {
      e.preventDefault();
      setIsLoading(true);

      if (currentUser) {
        const credential = EmailAuthProvider.credential(
          currentUser.email ? currentUser.email : "",
          password,
        );

        await reauthenticateWithCredential(currentUser, credential);
        // If reauthentication is successful, delete user from firebase
        await deleteTheUser();
        const response = await fetch(
          `http://localhost:3000/user-services/delete/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );

        if (!response.ok) {
          // Account deletion from psql failed
          const data = await response.json();
          console.error("Failed to delete account from psql:", data.message);
        }
        navigate(`/`);
      }
    } catch (error: any) {
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
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={styles.deleteModalCard}>
          <h2>Confirm Account Deletion</h2>
          <p>Enter password to confirm account deletion</p>
          <div>
            <label htmlFor="password">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <br />
          <div className={styles.modalButtons}>
            <button
              type="button"
              disabled={isLoading}
              className={styles.deleteAccountButton}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                onClose();
              }}
              disabled={isLoading}
              className={styles.cancelDeleteButton}
            >
              Cancel
            </button>
          </div>
          {message && <p className="text">{message}</p>}
        </div>
      </form>
    </Modal>
  );
}
