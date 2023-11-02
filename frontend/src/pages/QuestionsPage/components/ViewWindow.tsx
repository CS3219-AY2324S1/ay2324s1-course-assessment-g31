import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { QuestionViewContext } from "../../../context/QuestionViewContext";
import { useAuth } from "../../../context/AuthContext";

export default function ViewWindow() {
  const { selectedAttempt, selectedQuestion, unselectAll } =
    useContext(QuestionViewContext);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { currentRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateQuestion = () => {
    navigate(`/questions/form`);
  };

  const handleEditQuesiton = () => {
    navigate(`/questions/form/?id=${selectedQuestion?.id}`);
  };

  const handleDeleteQuestion = async () => {
    setIsDeleting(true);
    if (window.confirm("Are you sure you want to delete this question")) {
      try {
        const response = await fetch(
          `http://localhost:5003/delete/${selectedQuestion?.id}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw Error(data.error);
        } else {
          setIsDeleting(false);
          unselectAll();
          window.location.reload();
        }
      } catch (err: any) {
        window.alert(err.message);
      }
    }
    setIsDeleting(false);
  };

  return (
    <div>
      <span>
        {currentRole} / {currentUser?.uid}
      </span>
      {selectedAttempt && (
        <div className="border border-black border-1 border-solid">
          <p className="whitespace-pre">{selectedAttempt.code}</p>
        </div>
      )}
      <button onClick={handleCreateQuestion} type="button">
        Create Question
      </button>
      {selectedQuestion && (
        <div className="border border-black border-1 border-solid">
          <h2 className="text-2xl">{selectedQuestion.title}</h2>
          <p className="whitespace-pre">{selectedQuestion.description}</p>
          <button
            onClick={handleDeleteQuestion}
            type="button"
            disabled={isDeleting}
          >
            Delete
          </button>
          <button onClick={handleEditQuesiton} type="button">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
