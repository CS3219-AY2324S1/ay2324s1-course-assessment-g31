import { uuidv4 } from "@firebase/util";
import { TrashIcon } from "@heroicons/react/24/outline";
import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  BasicSetupOptions,
  Extension,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { useCallback, useContext, useEffect, useState } from "react";

import { DarkModeContext } from "../context/DarkModeContext";
import { QuestionContext } from "../context/QuestionContext";
import { QuestionSolutionUpdateDTO } from "../interfaces/questionService/questionSolution/updateDTO";
import { QuestionTestCase } from "../interfaces/questionService/questionTestCase/object";

function UpdateCodeEditor() {
  const {
    question,
    initialCode,
    runnerCode,
    selectedLanguage,
    solutionCodes,
    saveNewInitialCode,
    saveNewRunnerCode,
    saveNewTestCases,
    saveNewSolutionCodes,
  } = useContext(QuestionContext);
  const { isDarkMode } = useContext(DarkModeContext);

  const [initializing, setInitializing] = useState<boolean>(true);
  const [_codeSubmitted, setCodeSubmitted] = useState<boolean>(false);
  const [extensions, setExtensions] = useState<Extension[]>();
  const [localInitialCode, setLocalInitialCode] = useState<string>("");
  const [localRunnerCode, setLocalRunnerCode] = useState<string>("");
  const [localSolutionCodes, setLocalSolutionCodes] = useState<
    QuestionSolutionUpdateDTO[]
  >([]);
  const [testCases, setTestCases] = useState<QuestionTestCase[]>();

  const handleLocalInitialCodeChange = useCallback(
    (value: string, _viewUpdate: ViewUpdate) => {
      setLocalInitialCode(value);
    },
    [setLocalInitialCode],
  );

  const handleLocalRunnerCodeChange = useCallback(
    (value: string, _viewUpdate: ViewUpdate) => {
      setLocalRunnerCode(value);
    },
    [setLocalRunnerCode],
  );

  const handleLocalSolutionCodeChange = useCallback(
    (value: string, _viewUpdate: ViewUpdate, solutionId: string) => {
      setLocalSolutionCodes((prevState) =>
        prevState.map((x) => {
          if (x.id === solutionId) {
            return {
              ...x,
              code: value,
            };
          }
          return x;
        }),
      );
    },
    [setLocalSolutionCodes],
  );

  const handleTitleChange = useCallback(
    (newTitle: string, solutionId: string) => {
      setLocalSolutionCodes((prevState) =>
        prevState.map((x) => {
          if (x.id === solutionId) {
            return {
              ...x,
              title: newTitle,
            };
          }
          return x;
        }),
      );
    },
    [setLocalSolutionCodes],
  );

  const handleDescriptionChange = useCallback(
    (newDescription: string, solutionId: string) => {
      setLocalSolutionCodes((prevState) =>
        prevState.map((x) => {
          if (x.id === solutionId) {
            return {
              ...x,
              description: newDescription,
            };
          }
          return x;
        }),
      );
    },
    [setLocalSolutionCodes],
  );

  useEffect(() => {
    if (langs[selectedLanguage]) {
      setExtensions([langs[selectedLanguage]()]);
    } else {
      setExtensions([]);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (question) {
      setTestCases(question.testCases);
    }
  }, [question, selectedLanguage]);

  useEffect(() => {
    setLocalInitialCode(initialCode);
    setInitializing(false);
  }, [initialCode, setLocalInitialCode]);

  useEffect(() => {
    setLocalRunnerCode(runnerCode);
    setInitializing(false);
  }, [runnerCode, setLocalRunnerCode]);

  useEffect(() => {
    setLocalSolutionCodes(solutionCodes);
    setInitializing(false);
  }, [solutionCodes, setLocalSolutionCodes]);

  const codeMirrorOptions: BasicSetupOptions = {
    indentOnInput: true,
  };

  return (
    <div className="lg:grid lg:grid-cols-2 gap-4">
      <div>
        <h1 className="font-semibold mb-2">Initial Code</h1>
        <div className="min-h-144 border rounded-lg shadow">
          <CodeMirror
            value={localInitialCode}
            height="500px"
            extensions={extensions}
            onChange={handleLocalInitialCodeChange}
            theme={isDarkMode ? "dark" : "light"}
            basicSetup={codeMirrorOptions}
          />
        </div>
        <div className="flex flex-row-reverse mt-5 gap-3">
          <button
            type="button"
            className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
            onClick={() => {
              saveNewInitialCode(selectedLanguage, localInitialCode);
            }}
          >
            Save Initial Code
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-semibold mb-2">Runner Code</h1>
        <div className="min-h-144 border rounded-lg shadow">
          <CodeMirror
            value={localRunnerCode}
            height="500px"
            extensions={extensions}
            onChange={handleLocalRunnerCodeChange}
            theme={isDarkMode ? "dark" : "light"}
            basicSetup={codeMirrorOptions}
          />
        </div>
        <div className="flex flex-row-reverse mt-5 gap-3">
          <button
            type="button"
            className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
            onClick={() => {
              saveNewRunnerCode(selectedLanguage, localRunnerCode);
            }}
          >
            Save Runner Code
          </button>
        </div>
      </div>

      <div className="col-span-2">
        <h1 className="font-semibold mb-2">Solution Code</h1>
        <div className="flex gap-4">
          {localSolutionCodes.map((code) => (
            <div className="w-1/2">
              <h1>{`Solution ${code.id}`}</h1>

              <div className="my-2">
                <label
                  htmlFor={`solution-${code.id}-title`}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name={`solution-${code.id}-title`}
                    id={`solution-${code.id}-title`}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Title"
                    onChange={(e) => handleTitleChange(e.target.value, code.id)}
                  />
                </div>
              </div>

              <div className="my-2">
                <label
                  htmlFor={`solution-${code.id}-description`}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name={`solution-${code.id}-description`}
                    id={`solution-${code.id}-description`}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Description"
                    onChange={(e) =>
                      handleDescriptionChange(e.target.value, code.id)
                    }
                  />
                </div>
              </div>
              <div className="min-h-144 w-full border rounded-lg shadow">
                <CodeMirror
                  value={code.code}
                  height="500px"
                  extensions={extensions}
                  onChange={(value, viewUpdate) =>
                    handleLocalSolutionCodeChange(value, viewUpdate, code.id)
                  }
                  theme={isDarkMode ? "dark" : "light"}
                  basicSetup={codeMirrorOptions}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row-reverse mt-5 gap-3">
          <button
            type="button"
            className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
            onClick={() => {
              saveNewSolutionCodes(localSolutionCodes);
            }}
          >
            Save Solution Codes
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
            onClick={() => {
              setLocalSolutionCodes((prevState) => [
                ...prevState,
                {
                  id: uuidv4(),
                  title: "",
                  description: "",
                  language: selectedLanguage,
                  code: "// Default Code",
                  questionId: question.id,
                },
              ]);
            }}
          >
            Add New Solution Codes
          </button>
        </div>
      </div>

      <div className="mt-5 col-span-2">
        <div className="border rounded-lg shadow p-5">
          <h1 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
            Edit Test Cases
          </h1>
          <div className="flex flex-row flex-wrap">
            {testCases &&
              testCases.map((testCase) => (
                <div className="shadow rounded p-5 w-1/4">
                  <div className="flex">
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          className="inline-flex rounded-md bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-50"
                          onClick={() => {
                            setTestCases(
                              testCases.filter(
                                (x) =>
                                  x.testCaseNumber !== testCase.testCaseNumber,
                              ),
                            );
                          }}
                        >
                          <span className="sr-only">Dismiss</span>
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="font-bold">{testCase.testCaseNumber}</p>
                  <label
                    htmlFor={`testCaseInput-${testCase.testCaseNumber}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Input
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name={`testCaseInput-${testCase.testCaseNumber}`}
                      id={`testCaseInput-${testCase.testCaseNumber}`}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={testCase.input}
                      onChange={(e) => {
                        if (testCases) {
                          setTestCases(
                            testCases.map((x) =>
                              x.testCaseNumber === testCase.testCaseNumber
                                ? { ...x, input: e.target.value }
                                : x,
                            ),
                          );
                        }
                      }}
                    />
                  </div>
                  <label
                    htmlFor={`testCaseExpectedOutput-${testCase.testCaseNumber}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Expected Output
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name={`testCaseExpectedOutput-${testCase.testCaseNumber}`}
                      id={`testCaseExpectedOutput-${testCase.testCaseNumber}`}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={testCase.expectedOutput}
                      onChange={(e) => {
                        if (testCases) {
                          setTestCases(
                            testCases.map((x) =>
                              x.testCaseNumber === testCase.testCaseNumber
                                ? {
                                    ...x,
                                    expectedOutput: e.target.value.split(","),
                                  }
                                : x,
                            ),
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-row-reverse mt-5 gap-3">
            <button
              type="button"
              className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
              onClick={() => {
                if (testCases) {
                  console.log(testCases);
                  saveNewTestCases(testCases);
                }
              }}
            >
              Edit Test Cases
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
              onClick={() => {
                if (testCases) {
                  setTestCases([
                    ...testCases,
                    {
                      testCaseNumber: testCases.length + 1,
                      input: "",
                      expectedOutput: [""],
                      questionId: question.id,
                    },
                  ]);
                }
              }}
            >
              Add New Test Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateCodeEditor;
