import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Question } from "../../../types/question";
import Solutions from "./Solutions";

export default function QuestionAndSolution() {
  const { id: questionId } = useParams();

  const [question, setQuestion] = useState<Question>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // either view solutions question
  const [isViewSolution, setIsViewSolution] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleEditQuesiton = () => {
    navigate(`/questions/form/?id=${question?.id}`);
  };

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDeleteQuestion = async () => {
    setIsDeleting(true);
    if (window.confirm("Are you sure you want to delete this question")) {
      try {
        const response = await fetch(
          `http://localhost:5003/question/${question?.id}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw Error(data.error);
        } else {
          setIsDeleting(false);
          navigate("/questions");
        }
      } catch (err: any) {
        window.alert(err.message);
      }
    }
    setIsDeleting(false);
  };

  const fetchQuestion = async () => {
    setQuestion(undefined);
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5003/question/${questionId}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      } else {
        setQuestion(data);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  if (error) return <div>Error loading question: {error}</div>;

  if (isLoading) return <div>Loading question</div>;

  return (
    <div>
      <div>
        <span
          role="button"
          tabIndex={0}
          onKeyDown={() => setIsViewSolution(false)}
          onClick={() => setIsViewSolution(false)}
        >
          Description
        </span>
        <span
          role="button"
          tabIndex={0}
          onKeyDown={() => setIsViewSolution(true)}
          onClick={() => setIsViewSolution(true)}
        >
          Solutions {`(${question?.solutions.length})`}
        </span>
      </div>
      {question && !isViewSolution && (
        <div>
          <button type="button" onClick={handleEditQuesiton}>
            Edit Question
          </button>
          <button
            type="button"
            onClick={handleDeleteQuestion}
            disabled={isDeleting}
          >
            Delete Question
          </button>
          <p>{question.description}</p>
          <p>{question.example}</p>
        </div>
      )}
      {question && isViewSolution && (
        <Solutions solutions={question.solutions} questionId={question.id} />
      )}
    </div>
  );
}
