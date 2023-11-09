import React, { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  Category,
  CategoryMap,
  Difficulties,
  Difficulty,
  Question,
} from "../../types/question";
import styles from "./QuestionForm.module.css";

export default function QuestionForm() {
  // fetching questionToEdit
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("id");
  const [questionToEdit, setQuestionToEdit] = useState<Question>();
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Form fields
  const [title, setTitle] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    Difficulties[0],
  );
  const [description, setDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [example, setExample] = useState<string>("");
  const [constraint, setConstraint] = useState<string>("");

  // submitting
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value as Category;
    if (selectedCategory.includes(selectedValue)) {
      setSelectedCategory(
        selectedCategory.filter((value) => value !== selectedValue),
      );
    } else {
      setSelectedCategory([...selectedCategory, selectedValue]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(
        questionToEdit
          ? `http://localhost:5003/question/${questionToEdit.id}`
          : "http://localhost:5003/question",
        {
          method: questionToEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            difficulty: selectedDifficulty,
            category: selectedCategory,
            description,
            example,
            constraint,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      }
      setIsSubmitting(false);
      // Success
      navigate("/questions");
    } catch (err: any) {
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  const fetchQuestion = async (id: number) => {
    setFetchError(false);
    setIsFetching(true);
    try {
      const response = await fetch(`http://localhost:5003/question/${id}`, {
        method: "GET",
      });

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      } else {
        setQuestionToEdit(data);
        setIsFetching(false);
      }
    } catch (err: any) {
      setFetchError(true);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // fetch question from id in search params to edit
    if (questionId) {
      const id = parseInt(questionId, 10);
      if (Number.isNaN(id)) {
        setQuestionToEdit(undefined);
      }
      fetchQuestion(id);
    } else {
      setQuestionToEdit(undefined);
    }
  }, [questionId]);

  useEffect(() => {
    if (questionToEdit) {
      // prefill form with question to edit
      setTitle(questionToEdit.title);
      setSelectedDifficulty(questionToEdit.difficulty);
      setSelectedCategory([...questionToEdit.category]);
      setDescription(questionToEdit.description);
      setExample(questionToEdit.example);
      setConstraint(questionToEdit.constraint);
    } else {
      // return to default
      setTitle("");
      setSelectedDifficulty(Difficulties[0]);
      setSelectedCategory([]);
      setDescription("");
      setExample("");
      setConstraint("");
    }
  }, [questionToEdit]);

  if (isFetching) {
    return <h2>Loading</h2>;
  }

  if (fetchError) {
    return <h2>Error fetching question details</h2>;
  }

  return (
    <div>
      <h2>Editing: {!!questionToEdit}</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <label htmlFor="title">
          Question Title:
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <div className={styles.complexityContainer}>
          <span>Difficulty:</span>
          {Difficulties.map((difficulty) => (
            <div key={difficulty}>
              <input
                type="radio"
                id={difficulty}
                name="difficulty"
                value={difficulty}
                onChange={() => setSelectedDifficulty(difficulty)}
                checked={selectedDifficulty === difficulty}
              />
              <label htmlFor={difficulty}>{difficulty}</label>
            </div>
          ))}
        </div>
        <span>Category:</span>
        <div className={styles.categoryContainer}>
          {Object.values(CategoryMap).map((category) => (
            <div key={category}>
              <input
                type="checkbox"
                id={category}
                value={category}
                onChange={handleCheckboxChange}
                checked={selectedCategory.includes(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
        <label htmlFor="description">
          Question Description:
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label htmlFor="example">
          Question Example:
          <textarea
            id="example"
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />
        </label>
        <label htmlFor="constraint">
          Question Constraint:
          <textarea
            id="constraint"
            value={constraint}
            onChange={(e) => setConstraint(e.target.value)}
          />
        </label>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {questionToEdit ? "save changes" : "create"}
          </button>
        </div>
      </form>
      {submitError && <span>{submitError}</span>}
    </div>
  );
}
