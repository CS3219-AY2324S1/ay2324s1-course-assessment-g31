import { useEffect, useState } from "react";
import { Question } from "../../../types/question";
import QuestionCard from "./QuestionCard";
import styles from "./QuestionsList.module.css";

interface QuestionsListProps {
  setQuestionToEdit: React.Dispatch<React.SetStateAction<Question | undefined>>;
}

export default function QuestionsList({
  setQuestionToEdit,
}: QuestionsListProps) {
  const [questions, setQuestions] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchQuestions = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/all", {
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

  if (error) return <div>Error loading questions</div>;

  if (isLoading) return <div>Loading questions</div>;

  return (
    <div className={styles.listContainer}>
      <h2>Questions</h2>
      {questions?.map((question, index) => (
        <QuestionCard
          key={question._id}
          question={question}
          index={index}
          setQuestionToEdit={setQuestionToEdit}
        />
      ))}
    </div>
  );
}
