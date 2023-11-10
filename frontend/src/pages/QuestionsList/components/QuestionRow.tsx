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
          className="underline text-indigo-700 font-semibold"
        >
          {question.title}
        </span>
      </td>
      <td>{question.difficulty}</td>
      <td className="flex flex-row gap-2">
        {question.category.sort().map((cat) => (
          <span key={cat}>{cat}</span>
        ))}
      </td>
      <td>{question.popularity}</td>
      <td>{numAttempts}</td>
    </tr>
  );
}
