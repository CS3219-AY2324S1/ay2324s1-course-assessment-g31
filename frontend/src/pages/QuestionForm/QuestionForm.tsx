import React, { ChangeEvent, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  Categories,
  CategoriesMap,
  Difficulties,
  Difficulty,
  Question,
} from "../../types/question";
import styles from "./QuestionForm.module.css";
import QuestionController from "../../controllers/question/question.controller";
import { FullQuestion } from "../../interfaces/questionService/fullQuestion/object";
import { QuestionCategory } from "../../interfaces/questionService/questionCategory/object";

export default function QuestionForm() {
  const questionController = useMemo(() => new QuestionController(), []);
  // fetching questionToEdit
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("id");
  const [questionToEdit, setQuestionToEdit] = useState<FullQuestion>();
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Form fields
  const [title, setTitle] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
    Difficulties[0],
  );
  const [description, setDescription] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<QuestionCategory[]>([]);
  const [example, setExample] = useState<string>("");
  const [constraint, setConstraint] = useState<string>("");

  // submitting
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value
    if (selectedCategories.map(x=>x.name).includes(selectedValue)) {
      setSelectedCategories(
        selectedCategories.filter((value) => value.name !== selectedValue),
      );
    } else {
      setSelectedCategories([...selectedCategories, {name: selectedValue,questionId: parseInt(questionId!,10)}]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    console.log(
      JSON.stringify({
        title,
        difficulty: selectedDifficulty,
        categories: selectedCategories,
        description,
        example,
        constraint,
      }),
    );
    try {
      if (questionToEdit) {
        const res = await questionController.updateQuestion(questionToEdit.id, {
          title,
          difficulty: selectedDifficulty,
          categories: selectedCategories,
          description,
          examples: [example],
          constraints: [constraint],
        });
        console.log(res);
      } else {
        const res = await questionController.createQuestion({
          title,
          difficulty: selectedDifficulty,
          categories: selectedCategories,
          description,
          examples: [example],
          constraints: [constraint],
          authorId:'abc123',
          initialCodes: [],
          runnerCodes: [],
          testCases: [],
          solutions: []
        });
        console.log(res);
      }
      // TODO: Handle Errors
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
      const res = await questionController.getQuestionById(id);

      if (res.success && res.data) {
        setQuestionToEdit(res.data.data);
        setIsFetching(false);

      } else {
        throw Error(res.errors[0]);

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
      setSelectedCategories([...questionToEdit.categories]);
      setDescription(questionToEdit.description);
      setExample(questionToEdit.example);
      setConstraint(questionToEdit.constraint);
    } else {
      // return to default
      setTitle("");
      setSelectedDifficulty(Difficulties[0]);
      setSelectedCategories([]);
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
        <span>Categories:</span>
        <div className={styles.categoriesContainer}>
          {Object.values(CategoriesMap).map((categories) => (
            <div key={categories}>
              <input
                type="checkbox"
                id={categories}
                value={categories}
                onChange={handleCheckboxChange}
                checked={selectedCategories.includes(categories)}
              />
              <label htmlFor={categories}>{categories}</label>
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
