// import { Disclosure } from "@headlessui/react";
// import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Question } from "../../../types/question";

interface IQuestionCardProps {
  question: Question;
  index: number;
  onSelect: () => void;
  selected: boolean;
  numAttempts: number;
}

export default function QuestionCard({
  question,
  index,
  onSelect,
  selected,
  numAttempts,
}: IQuestionCardProps) {
  return (
    <tr className={`${selected ? "bg-cyan-400" : ""}`}>
      <td>{question.id}</td>
      <td>
        <span
          role="button"
          tabIndex={index}
          onKeyDown={onSelect}
          onClick={onSelect}
          className="underline text-blue-700 font-bold"
        >
          {question.title}
        </span>
      </td>
      <td>{question.complexity}</td>
      <td>
        {question.category.map((cat) => (
          <span key={cat}>{cat}</span>
        ))}
      </td>
      <td>{numAttempts}</td>
    </tr>
  );
}
