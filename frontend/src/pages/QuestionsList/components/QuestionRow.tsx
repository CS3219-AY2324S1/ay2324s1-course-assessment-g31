import { useNavigate } from "react-router";
import { Question } from "../../../types/question";

interface IQuestionRowProps {
  question: Question;
  index: number;
}

export default function QuestionRow({ question, index }: IQuestionRowProps) {
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
      <td className="text-center font-bold">{question.difficulty}</td>
      <td className="flex flex-row gap-2">
        {question.category.sort().map((cat) => (
          <span className="underline text-slate-600" key={cat}>
            {cat}
          </span>
        ))}
      </td>
      <td className="text-center">{question.popularity}</td>
    </tr>
  );
}
