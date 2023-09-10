import { useState } from "react";
import { Question } from "../../../types/question";

interface QuestionCardProps {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const handleShowDescription = () => setShowDescription(!showDescription);

  return (
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
    </div>
  );
}
