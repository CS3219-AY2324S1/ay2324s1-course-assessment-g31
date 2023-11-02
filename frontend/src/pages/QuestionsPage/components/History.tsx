import React, { useContext } from "react";
import { QuestionViewContext } from "../../../context/QuestionViewContext";
import { Attempt } from "../../../types/history";

export default function History() {
  const { selectedAttempt, selectedQuestion, selectAttempt, questionHistory } =
    useContext(QuestionViewContext);

  const handleClick = (attempt: Attempt) => {
    selectAttempt(attempt);
  };

  if (!selectedQuestion) {
    return null;
  }

  if (questionHistory.length === 0) {
    return <h2 className="font-bold text-2xl">No attempts</h2>;
  }

  return (
    <div>
      <h2 className="font-bold text-2xl">Attempt History</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Language</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {questionHistory.map((attempt, index) => {
            const selected: boolean = !!(selectedAttempt?.id === attempt.id);
            console.log(selectedAttempt?.id, attempt);
            return (
              <tr className={`${selected ? "bg-red-500" : "bg-white"}`}>
                <td>{index}</td>
                <td>
                  <span
                    role="button"
                    tabIndex={index}
                    onClick={() => handleClick(attempt)}
                    onKeyDown={() => handleClick(attempt)}
                    className="underline text-blue-700"
                  >
                    {attempt.language}
                  </span>
                </td>
                <td>{attempt.attemptDateTime.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
