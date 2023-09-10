import { ChangeEvent, useState, useEffect } from "react";
import {
  Category,
  CategoryMap,
  Complexity,
  ComplexityMap,
  Question,
} from "../../../types/question";
import styles from "./QuestionForm.module.css";

interface QuestionFormProps {
  questionToEdit: Question | undefined;
  setQuestionToEdit: React.Dispatch<React.SetStateAction<Question | undefined>>;
}

export default function QuestionForm({
  questionToEdit,
  setQuestionToEdit,
}: QuestionFormProps) {
  const [title, setTitle] = useState<string>("");
  const [selectedComplexity, setSelectedComplexity] =
    useState<Complexity>("EASY");
  const [description, setDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");

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
    setError("");
    try {
      const response = await fetch(
        questionToEdit
          ? `http://localhost:5000/update/${questionToEdit._id}`
          : "http://localhost:5000/create",
        {
          method: questionToEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            complexity: selectedComplexity,
            category: selectedCategory,
            description,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      }
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (questionToEdit) {
      // prefill form with question to edit
      setTitle(questionToEdit.title);
      setSelectedComplexity(questionToEdit.complexity);
      setSelectedCategory([...questionToEdit.category]);
      setDescription(questionToEdit.description);
    } else {
      // return to default
      setTitle("");
      setSelectedComplexity("EASY");
      setSelectedCategory([]);
      setDescription("");
    }
  }, [questionToEdit]);

  return (
    <div>
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
          <span>Complexity:</span>
          {Object.values(ComplexityMap).map((complexity) => (
            <div key={complexity}>
              <input
                type="radio"
                id={complexity}
                name="complexity"
                value={complexity}
                onChange={() => setSelectedComplexity(complexity)}
                checked={selectedComplexity === complexity}
              />
              <label htmlFor={complexity}>{complexity}</label>
            </div>
          ))}
        </div>
        <div className={styles.categoryContainer}>
          <span>Category:</span>
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
        <div>
          <button type="submit">
            {questionToEdit ? "save changes" : "create"}
          </button>
          {questionToEdit && (
            <button type="button" onClick={() => setQuestionToEdit(undefined)}>
              cancel
            </button>
          )}
        </div>
      </form>
      {error && <span>{error}</span>}
    </div>
  );
}
