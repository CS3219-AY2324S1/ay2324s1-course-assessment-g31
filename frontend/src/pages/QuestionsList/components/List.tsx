import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router";
import { CategoryMap, Difficulties, Question } from "../../../types/question";
import QuestionRow from "./QuestionRow";
import { Attempt } from "../../../types/history";
import { useAuth } from "../../../context/AuthContext";

interface IQuestionAttempts {
  questionId: number;
  attempts: Attempt[];
}

export default function List() {
  const [questions, setQuestions] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Filtering
  const [search, setSearch] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  // Sorting
  const sortingFields = ["title", "popularity"];
  const sortingOptions = ["asc", "desc"];
  const [sortBy, setSortBy] = useState<string>(sortingFields[0]);
  const [sortOrder, setSortOrder] = useState<string>(sortingOptions[0]);

  const handleDifficultyFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (difficultyFilter === value) {
      setDifficultyFilter("");
    } else {
      setDifficultyFilter(value);
    }
  };

  const handleCategoryFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (categoryFilter.includes(value)) {
      setCategoryFilter(categoryFilter.filter((cat) => cat !== value));
    } else {
      setCategoryFilter([...categoryFilter, value]);
    }
  };

  const navigate = useNavigate();
  const handleAddQuestion = () => {
    navigate("/questions/form");
  };

  const fetchQuestions = useCallback(async () => {
    setQuestions(undefined);
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5003/question?sortBy=${sortBy}&order=${sortOrder}&title=${search}&difficulty=${difficultyFilter}&${categoryFilter.map(
          (category) => `category=${category}&`,
        )}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      } else {
        setQuestions(data.results);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [sortBy, sortOrder, search, difficultyFilter, categoryFilter]);

  // fetching user attempts
  const { currentUser } = useAuth();
  const [historyMap, setHistoryMap] = useState<Map<number, Attempt[]>>();

  const fetchHistory = useCallback(async () => {
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
  }, [currentUser]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (error) return <div>Error loading questions: {error}</div>;

  if (isLoading) return <div>Loading questions</div>;

  return (
    <div>
      <button type="button" onClick={handleAddQuestion}>
        Add Question
      </button>
      <div className="flex flex-row">
        <input
          placeholder="Search..."
          id="search-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="border border-solid border-black border-1"
          type="button"
          onClick={fetchQuestions}
        >
          Search
        </button>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col">
          {Difficulties.map((difficulty) => (
            <div key={difficulty}>
              <input
                type="checkbox"
                id={difficulty}
                value={difficulty}
                onChange={handleDifficultyFilter}
                checked={difficultyFilter === difficulty}
              />
              <label htmlFor={difficulty}>{difficulty}</label>
            </div>
          ))}
        </div>
        <div>
          {Object.values(CategoryMap).map((category) => (
            <div key={category}>
              <input
                type="checkbox"
                id={category}
                value={category}
                onChange={handleCategoryFilter}
                checked={categoryFilter.includes(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row">
        {sortingFields.map((field) => (
          <div key={field}>
            <input
              type="checkbox"
              id={field}
              value={field}
              onChange={() => setSortBy(field)}
              checked={sortBy === field}
            />
            <label htmlFor={field}>{field}</label>
          </div>
        ))}
        {sortingOptions.map((option) => (
          <div key={option}>
            <input
              type="checkbox"
              id={option}
              value={option}
              onChange={() => setSortOrder(option)}
              checked={sortOrder === option}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
      <table>
        <thead>
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
    </div>
  );
}
