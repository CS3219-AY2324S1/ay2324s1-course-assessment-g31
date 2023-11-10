import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Attempt } from "../../../types/history";

import { useAuth } from "../../../context/AuthContext";

export default function History() {
  const { id: questionId } = useParams();

  const [history, setHistory] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedAttempt, setSelectedAttempt] = useState<Attempt>();

  const { currentUser } = useAuth();

  const fetchHistory = useCallback(async () => {
    if (currentUser) {
      setHistory([]);
      setError("");
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5007/${currentUser.uid}/${questionId}`,
          {
            method: "GET",
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw Error(data.error);
        } else {
          setHistory(data);
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  }, [currentUser, questionId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (error) return <div>Error loading history: {error}</div>;

  if (isLoading) return <div>Loading history</div>;

  if (history.length === 0) {
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
          {history.map((attempt, index) => {
            const selected: boolean = !!(selectedAttempt?.id === attempt.id);
            console.log(selectedAttempt?.id, attempt);
            return (
              <tr className={`${selected ? "bg-red-500" : "bg-white"}`}>
                <td>{index}</td>
                <td>
                  <span
                    role="button"
                    tabIndex={index}
                    onClick={() => setSelectedAttempt(attempt)}
                    onKeyDown={() => setSelectedAttempt(attempt)}
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
      <p>{selectedAttempt?.code}</p>
    </div>
  );
}
