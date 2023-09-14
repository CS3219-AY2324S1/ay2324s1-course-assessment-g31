import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import styles from "./DeleteProfileModal.module.css"; // Create a CSS module for modal styles

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
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user-services/delete/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Account deletion was successful
        navigate("/user/login");
      } else {
        // Account deletion failed
        const data = await response.json();
        console.error("Failed to delete account:", data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.deleteModalCard}>
        <h2>Confirm Account Deletion</h2>
        <p>Are you sure you want to delete your account?</p>
        <div className={styles.modalButtons}>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className={styles.deleteAccountButton}
          >
            Delete Account
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelDeleteButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
