import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import QuestionNew from "../../../components/QuestionNew";
import QuestionController from "../../../controllers/question/question.controller";
import { FullQuestion } from "../../../interfaces/questionService/fullQuestion/object";
import Solutions from "./Solutions";

export default function QuestionAndSolution() {
  const { id: questionId } = useParams();

  const [question, setQuestion] = useState<FullQuestion>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // either view solutions question
  const [isViewSolution, setIsViewSolution] = useState<boolean>(false);

  const questionController = useMemo(() => new QuestionController(), []);

  const navigate = useNavigate();
  const handleEditQuesiton = () => {
    navigate(`/questions/form/?id=${question?.id}`);
  };

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDeleteQuestion = async () => {
    setIsDeleting(true);
    if (
      question &&
      window.confirm("Are you sure you want to delete this question")
    ) {
      try {
        const res = await questionController.deleteQuestion(question.id);

        if (!res.success) {
          throw Error(res.errors[0]);
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

  const fetchQuestion = useCallback(async () => {
    setQuestion(undefined);
    setError("");
    setIsLoading(true);
    if (questionId) {
      try {
        const res = await questionController.getQuestionById(
          parseInt(questionId, 10),
        );
        if (res.success && res.data) {
          setQuestion(res.data.data);
          setIsLoading(false);
        } else {
          throw Error(res.errors[0]);
        }
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  }, [questionId, questionController]);

  useEffect(() => {
    fetchQuestion();
  }, [questionId, fetchQuestion]);

  if (error) return <div>Error loading question: {error}</div>;

  if (isLoading) return <div>Loading question</div>;

  const headerSelectedStyle =
    "block rounded-t-lg bg-indigo-600 px-3 py-2 text-center text-s font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
  const headerNotSelectedStyle =
    "block rounded-t-lg bg-indigo-300 px-3 py-2 text-center text-s font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

  return (
    <div className="border border-2 rounded-xl border-indigo-700 p-2 w-[calc(50%-2px)] bg-white">
      <div className="flex flex-row border-indigo-600 border-b-2 gap-x-3 mb-3">
        <span
          className={
            isViewSolution ? headerNotSelectedStyle : headerSelectedStyle
          }
          role="button"
          tabIndex={0}
          onKeyDown={() => setIsViewSolution(false)}
          onClick={() => setIsViewSolution(false)}
        >
          Description
        </span>
        <span
          className={
            isViewSolution ? headerSelectedStyle : headerNotSelectedStyle
          }
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
          <div className="flex flex-row gap-5 justify-end">
            <button
              className="block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={handleEditQuesiton}
            >
              Edit
            </button>
            <button
              className="block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={handleDeleteQuestion}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
          <QuestionNew question={question} />
        </div>
      )}
      {question && isViewSolution && (
        <Solutions
          solutions={question.solutions}
          questionId={question.id}
          refetch={fetchQuestion}
        />
      )}
    </div>
  );
}
