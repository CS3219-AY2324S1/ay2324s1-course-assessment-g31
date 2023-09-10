import { ChangeEvent, useState } from "react";
import {
  Category,
  CategoryMap,
  Complexity,
  ComplexityMap,
} from "../../../types/question";

export default function QuestionForm() {
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
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          complexity: selectedComplexity,
          category: selectedCategory,
          description,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw Error(data.error);
      }
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Question Title
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

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
        <label htmlFor="description">
          Question Description
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">submit</button>
      </form>
      {error && <span>{error}</span>}
    </div>
  );
}
