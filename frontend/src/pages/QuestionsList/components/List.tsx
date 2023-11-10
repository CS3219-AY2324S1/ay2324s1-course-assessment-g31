import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Question } from "../../../types/question";
import QuestionRow from "./QuestionRow";
import { Attempt } from "../../../types/history";
import { useAuth } from "../../../context/AuthContext";
import { FilterSortContext } from "../../../context/FilterSortContext";
import FilterSort from "./FilterSort";
import PageSelector from "./PageSelector";

interface IQuestionAttempts {
  questionId: number;
  attempts: Attempt[];
}

export default function List() {
  const MAX_PER_PAGE = 15;
  const [questions, setQuestions] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { sortBy, searchFilter, sortOrder, difficultyFilter, categoryFilter } =
    useContext(FilterSortContext);

  // Pagination
  const [questionCounter, setQuestionCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1); // 1 indexed pages

  const navigate = useNavigate();
  const handleAddQuestion = () => {
    navigate("/questions/form");
  };

  const fetchQuestions = async () => {
    setQuestions(undefined);
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5003/question?offset=${
          (currentPage - 1) * MAX_PER_PAGE
        }&limit=${MAX_PER_PAGE}&sortBy=${sortBy}&order=${sortOrder}&title=${searchFilter}&difficulty=${difficultyFilter}&${categoryFilter
          .map((category) => `category=${category}&`)
          .join("")}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      } else {
        setQuestions(data.results);
        setQuestionCount(data.count);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // fetching user attempts
  const { currentUser } = useAuth();
  const [historyMap, setHistoryMap] = useState<Map<number, Attempt[]>>();

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

  useEffect(() => {
    fetchQuestions();
  }, [sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  if (error) return <div>Error loading questions: {error}</div>;

  if (isLoading) return <div>Loading questions</div>;

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <FilterSort handleSearch={fetchQuestions} />

      <table className="border border-solid border-2 border-indigo-600 w-full">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th>Id</th>
            <th>Question</th>
            <th>Complexity</th>
            <th>Category</th>
            <th>Popularity</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          {questions?.map((question, index) => {
            const attempts = historyMap?.get(question.id) || [];
            return (
              <QuestionRow
                key={question.id}
                question={question}
                index={index}
                numAttempts={attempts.length}
              />
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-around w-full">
        <button
          className="max-h-8 max-w-xs block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          onClick={handleAddQuestion}
        >
          Create Question
        </button>
        <PageSelector
          totalPages={Math.ceil(questionCounter / MAX_PER_PAGE)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
