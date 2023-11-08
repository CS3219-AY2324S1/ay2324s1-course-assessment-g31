import { useNavigate } from "react-router";
import { Question } from "../../../types/question";

interface IQuestionRowProps {
  question: Question;
  index: number;
  numAttempts: number;
}

export default function QuestionRow({
  question,
  index,
  numAttempts,
}: IQuestionRowProps) {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate(`/questions/view/${question.id}`);
  };

  return (
    <tr>
      <td>{question.id}</td>
      <td>
        <span
          role="button"
          tabIndex={index}
          onKeyDown={handleSelect}
          onClick={handleSelect}
          className="underline text-blue-700 font-bold"
        >
          {question.title}
        </span>
      </td>
      <td>{question.difficulty}</td>
      <td>
        {question.category.map((cat) => (
          <span key={cat}>{cat}</span>
        ))}
      </td>
      <td>{question.popularity}</td>
      <td>{numAttempts}</td>
    </tr>
  );
}
