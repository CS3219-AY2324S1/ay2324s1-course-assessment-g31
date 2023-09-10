import { useState } from "react";
import { Question } from "../../../types/question";

interface QuestionCardProps {
  setQuestionToEdit: React.Dispatch<React.SetStateAction<Question | undefined>>;
  question: Question;
  index: number;
}

export default function QuestionCard({
  question,
  index,
  setQuestionToEdit,
}: QuestionCardProps) {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const handleShowDescription = () => setShowDescription(!showDescription);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this question")) {
      setError("");
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/delete/${question._id}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw Error(data.error);
        } else {
          setIsLoading(false);
          window.location.reload();
        }
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div
        onClick={handleShowDescription}
        onKeyDown={handleShowDescription}
        role="button"
        tabIndex={index}
      >
        <span>{question.title}</span>
        <span>{question.complexity}</span>
        {question.category.map((cat) => (
          <span key={cat}>{cat}</span>
        ))}
        {showDescription && <p>{question.description}</p>}

        {error && <span>{error}</span>}
      </div>
      <button type="button" disabled={isLoading} onClick={handleDeleteQuestion}>
        delete
      </button>
      <button type="button" onClick={() => setQuestionToEdit(question)}>
        edit
      </button>
    </div>
  );
}
