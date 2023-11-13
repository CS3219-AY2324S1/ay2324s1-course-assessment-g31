import { TrashIcon } from "@heroicons/react/24/outline";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { QuestionContext } from "../context/QuestionContext";
import { FullQuestionCreateDTO } from "../interfaces/questionService/fullQuestion/createDTO";
import ComponentContainer from "./container/Component";

type questionExample = {
  number: number;
  text: string;
};

type questionConstraint = {
  number: number;
  text: string;
};

function CreateQuestionForm() {
  const { question, controller } = useContext(QuestionContext);
  const { addNotification } = useContext(NotificationContext);
  const { currentUser } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [description, setDescription] = useState<string>("");
  const categories = useMemo(
    () => [
      "Strings",
      "DataStructures",
      "Algorithms",
      "BitManipulation",
      "Databases",
      "Arrays",
      "Brainteaser",
      "Recursion",
    ],
    [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [examples, setExamples] = useState<questionExample[]>(
    [] as unknown as questionExample[],
  );
  const [constraints, setConstraints] = useState<questionConstraint[]>(
    [] as unknown as questionConstraint[],
  );
  const navigate = useNavigate();

  function handleSaveFormData() {
    if (!currentUser) return;
    const createDTO: FullQuestionCreateDTO = {
      title,
      difficulty,
      description,
      categories: selectedCategories.map((x) => ({ name: x })),
      examples: examples.map((x) => x.text),
      constraints: constraints.map((x) => x.text),
      authorId: currentUser.uid,
      initialCodes: [],
      runnerCodes: [],
      testCases: [],
      solutions: [],
    };
    controller.createQuestion(createDTO).then((res) => {
      if (res && res.data) {
        addNotification({
          type: "success",
          message: "Question data successfully created!",
        });
        navigate(`/questions/${res.data.data.id}/edit`);
      }
    });
  }

  function addNewExample() {
    setExamples([...examples, { number: examples.length + 1, text: "" }]);
  }

  function addNewConstraint() {
    setConstraints([
      ...constraints,
      { number: constraints.length + 1, text: "" },
    ]);
  }

  function deleteExample(number: number) {
    setExamples(examples.filter((x) => x.number !== number));
  }

  function deleteConstraint(number: number) {
    setConstraints(constraints.filter((x) => x.number !== number));
  }

  function handleExampleTextChange(number: number, newText: string) {
    setExamples(
      examples.map((x) => (x.number === number ? { ...x, text: newText } : x)),
    );
  }

  function handleConstraintTextChange(number: number, newText: string) {
    setConstraints(
      constraints.map((x) =>
        x.number === number ? { ...x, text: newText } : x,
      ),
    );
  }

  function handleSelectedCategoriesChange(category: string) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((x) => x !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  return (
    <ComponentContainer>
      <div className="flex flex-row-reverse">
        <button
          type="button"
          className="rounded-md bg-slate-600 dark:bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 dark:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 dark:focus-visible:outline-slate-400"
          onClick={() => {
            navigate(`/questions/${question.id}`);
          }}
        >
          Return to Question
        </button>
      </div>

      <div className="space-y-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Form Data
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
          <div className="col-span-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-3">
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue="Easy"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="col-span-3">
            <label
              htmlFor="categories"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Categories
            </label>
            <div className="mt-2">
              <fieldset>
                <div className="">
                  {categories.map((category) => (
                    <div
                      key={`${category}`}
                      className="relative flex items-start py-2"
                    >
                      <div className="min-w-0 flex-1 text-sm leading-6">
                        <label
                          htmlFor={`category-${category}`}
                          className="select-none font-medium text-gray-900"
                        >
                          {category}
                        </label>
                      </div>
                      <div className="ml-3 flex h-6 items-center">
                        <input
                          id={`category-${category}`}
                          name={`category-${category}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          onChange={() => {
                            handleSelectedCategoriesChange(category);
                          }}
                          checked={selectedCategories.includes(category)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="col-span-full border-b border-gray-900/10 pb-12">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows={10}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="border-b border-gray-900/10 pb-12 col-span-6">
            <h1 className="text-lg font-bold">Constraints</h1>
            <div className="flex flex-col gap-3">
              {constraints.map((constraint) => (
                <div className="flex">
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor={`constraint-${constraint.number}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {`Constraint #${constraint.number}`}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name={`constraint-${constraint.number}`}
                        id={`constraint-${constraint.number}`}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={constraint.text}
                        onChange={(e) => {
                          handleConstraintTextChange(
                            constraint.number,
                            e.target.value,
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end ml-3">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-50"
                      onClick={() => {
                        deleteConstraint(constraint.number);
                      }}
                    >
                      <span className="sr-only">Dismiss</span>
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row-reverse w-full mt-5">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={addNewConstraint}
              >
                Add New Constraint
              </button>
            </div>
          </div>
          <div className="border-b border-gray-900/10 pb-12 col-span-6">
            <h1 className="text-lg font-bold">Examples</h1>
            <div className="flex flex-col gap-3">
              {examples.map((example) => (
                <div className="flex">
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor={`example-${example.number}`}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {`Example #${example.number}`}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name={`example-${example.number}`}
                        id={`example-${example.number}`}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={example.text}
                        onChange={(e) => {
                          handleExampleTextChange(
                            example.number,
                            e.target.value,
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end ml-3">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-50"
                      onClick={() => {
                        deleteExample(example.number);
                      }}
                    >
                      <span className="sr-only">Dismiss</span>
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row-reverse w-full mt-5">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={addNewExample}
              >
                Add New Example
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleSaveFormData}
        >
          Save
        </button>
      </div>
    </ComponentContainer>
  );
}

export default CreateQuestionForm;
