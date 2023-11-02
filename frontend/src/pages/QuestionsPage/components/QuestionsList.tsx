import React, { useEffect, useState, useContext } from "react";
import { Question } from "../../../types/question";
import QuestionCard from "./QuestionCard";

import { Attempt } from "../../../types/history";
import { useAuth } from "../../../context/AuthContext";
import { QuestionViewContext } from "../../../context/QuestionViewContext";

interface IQuestionAttempts {
  questionId: number;
  attempts: Attempt[];
}

export default function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>();
  const [historyMap, setHistoryMap] = useState<Map<number, Attempt[]>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { currentUser } = useAuth();
  const { selectedQuestion, selectQuestion } = useContext(QuestionViewContext);

  const fetchHistory = async () => {
    const response = await fetch(`http://localhost:5007/${currentUser?.uid}`, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      throw Error(data.error);
    }
    const attemptMap = new Map<number, Attempt[]>();
    data.history.map((questionAttempts: IQuestionAttempts) =>
      attemptMap.set(questionAttempts.questionId, questionAttempts.attempts),
    );
    setHistoryMap(attemptMap);
  };

  const fetchQuestions = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5003/all", {
        method: "GET",
      });

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      } else {
        setQuestions(data);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  if (error) return <div>Error loading questions</div>;

  if (isLoading) return <div>Loading questions</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Question</th>
            <th>Complexity</th>
            <th>Category</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          {questions?.map((question, index) => {
            const attempts = historyMap?.get(question.id) || [];
            const onSelect = () => {
              selectQuestion(question, attempts);
            };
            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onSelect={onSelect}
                selected={selectedQuestion?.id === question.id}
                numAttempts={attempts.length}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
