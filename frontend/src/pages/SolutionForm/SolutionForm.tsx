import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TSolution } from "../../types/question";

export default function SolutionForm() {
  const languageOptions = useMemo(() => ["python", "javascript"], []);

  // fetch solution to edit
  const [searchParams] = useSearchParams();
  const questionId = parseInt(searchParams.get("qid") || "", 10);
  const solutionId = searchParams.get("sid");
  const [solutionToEdit, setSolutionToEdit] = useState<TSolution>();
  const [fetchError, setFetchError] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchSolution = useCallback(async () => {
    setSolutionToEdit(undefined);
    setFetchError("");
    setIsFetching(true);
    try {
      const response = await fetch(
        `http://localhost:5003/solution/${solutionId}`,
        {
          method: "GET",
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      } else {
        setSolutionToEdit(data);
        setIsFetching(false);
      }
    } catch (err: any) {
      setFetchError(err.message);
      setIsFetching(false);
    }
  }, [solutionId]);

  // form fields
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>(languageOptions[0]);

  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(
        solutionToEdit
          ? `http://localhost:5003/solution/${solutionToEdit.id}`
          : "http://localhost:5003/solution",
        {
          method: solutionToEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId,
            title,
            description,
            code,
            language,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      }
      setIsSubmitting(false);
      // Success
      navigate(`/questions/view/${questionId}`);
    } catch (err: any) {
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // fetch solution from id in search params to edit
    if (solutionId) {
      fetchSolution();
    } else {
      setSolutionToEdit(undefined);
    }
  }, [fetchSolution, solutionId]);

  useEffect(() => {
    if (solutionToEdit) {
      // prefill form with question to edit
      setTitle(solutionToEdit.title);
      setDescription(solutionToEdit.description);
      setCode(solutionToEdit.code);
      setLanguage(solutionToEdit.language);
    } else {
      // return to default
      setTitle("");
      setDescription("");
      setCode("");
      setLanguage(languageOptions[0]);
    }
  }, [solutionToEdit, languageOptions]);

  // error handling
  if (Number.isNaN(questionId)) {
    return <h2>Error: Invalid question id</h2>;
  }

  if (solutionToEdit && solutionToEdit.questionId !== questionId) {
    return <h2>Error: solution does not belong to given questionId</h2>;
  }

  if (isFetching) {
    return <h2>Loading</h2>;
  }

  if (fetchError) {
    return <h2>Error fetching solution details</h2>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Solution Title:
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label htmlFor="description">
          Description:
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label htmlFor="code">
          Code:
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <div>
          <span>Complexity:</span>
          {languageOptions.map((languageOption) => (
            <div key={languageOption}>
              <input
                type="radio"
                id={languageOption}
                name="complexity"
                value={languageOption}
                onChange={() => setLanguage(languageOption)}
                checked={language === languageOption}
              />
              <label htmlFor={languageOption}>{languageOption}</label>
            </div>
          ))}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {solutionToEdit ? "save changes" : "create"}
          </button>
        </div>
      </form>
      {submitError && <span>{submitError}</span>}
    </div>
  );
}
