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

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDeleteAttempt = async (id: string) => {
    if (!isDeleting) {
      setIsDeleting(true);
      if (window.confirm("Are you sure you want to delete this question")) {
        try {
          const response = await fetch(`http://localhost:5007/${id}`, {
            method: "DELETE",
          });

          const data = await response.json();
          if (!response.ok) {
            throw Error(data.error);
          } else {
            setIsDeleting(false);
            fetchHistory();
          }
        } catch (err: any) {
          window.alert(err.message);
        }
      }
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="flex flex-col border border-2 rounded-xl border-indigo-700 p-2 w-[calc(50%-2px)] bg-white">
      <h2 className="font-bold text-2xl">Attempt History</h2>
      {error && <h2>Error loading history: {error}</h2>}
      {!error && isLoading && <h2>Loading history</h2>}
      {!error && !isLoading && history.length === 0 && (
        <h2 className="font-bold text-2xl">No attempts</h2>
      )}
      {!error && !isLoading && history.length !== 0 && (
        <div className="flex flex-col">
          <table className="my-3 border-2 border-indigo-600">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th>Id</th>
                <th>Language</th>
                <th>Date</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {history.map((attempt, index) => {
                const selected: boolean = !!(
                  selectedAttempt?.id === attempt.id
                );
                return (
                  <tr
                    className={`${selected ? "bg-slate-300" : ""}`}
                    role="button"
                    tabIndex={index}
                    onClick={() => setSelectedAttempt(attempt)}
                    onKeyDown={() => setSelectedAttempt(attempt)}
                  >
                    <td>{index}</td>
                    <td className="font-semibold text-indigo-700">
                      {attempt.language}
                    </td>
                    <td>{attempt.attemptDateTime.toLocaleString()}</td>
                    <td>
                      <span
                        role="button"
                        tabIndex={index}
                        onClick={() => handleDeleteAttempt(attempt.id)}
                        onKeyDown={() => handleDeleteAttempt(attempt.id)}
                        className="underline text-indigo-700 font-semibold"
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h2 className="text-lg font-semibold">{selectedAttempt?.language}</h2>
          <p className="whitespace-pre bg-gray-100 font-mono my-2">
            {selectedAttempt?.code}
          </p>
        </div>
      )}
    </div>
  );
}
