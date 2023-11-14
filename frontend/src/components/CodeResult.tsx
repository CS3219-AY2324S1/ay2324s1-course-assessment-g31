import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CollaborationContext } from "../context/CollaborationContext";
import { QuestionContext } from "../context/QuestionContext";
import Judge0Controller, {
  CodeInput,
  Submission,
  SubmissionParams,
  SubmissionTokenDTO,
} from "../controllers/judge0/judge0.controller";
import { FullTestCase } from "../interfaces/questionService/questionTestCase/object";
import { decode64, encode64 } from "../util/base64";
import TestCase from "./TestCase";
import AdminHoc from "./hocs/AdminHoc";
import { useAuth } from "../context/AuthContext";

function CodeResult() {
  const judge0Controller = useMemo(() => new Judge0Controller(), []);
  const { question, selectedLanguage } = useContext(QuestionContext);
  const { currentCode } = useContext(CollaborationContext);
  const [ongoingCodeExecutions, setOngoingCodeExecutions] =
    useState<SubmissionTokenDTO[]>();
  const [executedSubmissions, setExecutedSubmissions] =
    useState<Submission[]>();
  const [fullTestCases, setFullTestCases] = useState<FullTestCase[]>();
  const navigate = useNavigate();
  const { currentRole, currentUser } = useAuth();

  useEffect(() => {
    if (question) {
      setFullTestCases(
        question.testCases.map((x) => ({
          ...x,
          resultsAvailable: false,
          passed: true,
          running: false,
          actualOutput: "",
          executionToken: "",
        })),
      );
    }
  }, [question, selectedLanguage]);

  const handleSubmit = async () => {
    setFullTestCases(
      question.testCases.map((x) => ({
        ...x,
        resultsAvailable: false,
        passed: false,
        running: false,
        actualOutput: "",
        executionToken: "",
      })),
    );

    const runnerCode = question.runnerCodes.filter(
      (x) => x.language === selectedLanguage,
    )[0];

    const data: CodeInput[] = question.testCases.map((x) => ({
      source_code: encode64(
        decode64(runnerCode.code).replace(
          "@@@INSERT_CODE_HERE@@@",
          currentCode,
        ),
      ),
      stdin: encode64(x.input),
    }));

    const params: SubmissionParams = {
      wait: false,
      base64_encoded: true,
    };
    judge0Controller
      .postBatchSubmission(selectedLanguage, data, params)
      .then((res) => {
        console.log("Post Batch Submission", res.data);
        if (fullTestCases) {
          const updatedTestCases = fullTestCases.map((x, idx) => ({
            ...x,
            resultsAvailable: false,
            running: true,
            executionToken: res.data[idx].token,
          }));
          setFullTestCases(updatedTestCases);
        }
        setOngoingCodeExecutions(res.data);
      });
  };

  useEffect(() => {
    if (executedSubmissions) {
      console.log("Finished Submissions", executedSubmissions);
    }
  }, [executedSubmissions]);

  const handleBatchSubmissions = useCallback(() => {
    if (ongoingCodeExecutions) {
      const input = ongoingCodeExecutions.map((x) => x.token);
      console.log(input);
      judge0Controller.getBatchSubmission(input).then((res) => {
        console.log("Code Executions", res.data);
        const acceptedSubmissions = res.data.submissions.filter(
          (sub) => sub.status.id !== 1 && sub.status.id !== 2,
        );
        console.log("Accepted Submissions", acceptedSubmissions); // submissions that are completed
        const newOngoingCodeExecutions = ongoingCodeExecutions.filter(
          (codeExecutions) =>
            !acceptedSubmissions
              .map((x) => x.token)
              .includes(codeExecutions.token),
        );
        console.log("Ongoing Executions", newOngoingCodeExecutions);

        setOngoingCodeExecutions(newOngoingCodeExecutions);
        if (executedSubmissions) {
          setExecutedSubmissions([
            ...executedSubmissions,
            ...acceptedSubmissions,
          ]);
        }
        setExecutedSubmissions(acceptedSubmissions);

        if (fullTestCases) {
          const updatedTestCases = fullTestCases.map((testCase) => {
            const { executionToken } = testCase;
            if (
              acceptedSubmissions.map((z) => z.token).includes(executionToken)
            ) {
              const foundSubmission = acceptedSubmissions.find(
                (sub) => sub.token === executionToken,
              )!;
              console.log(foundSubmission);
              let passed: boolean = false;
              let actualOutput: string = "";
              switch (foundSubmission.status.id) {
                case 5:
                  actualOutput = "Time Limit Exceeded";
                  break;

                case 6:
                  actualOutput = "Compilation Error";
                  break;

                case 7 || 8 || 9 || 10 || 11 || 12 || 13 || 14:
                  actualOutput = "Runtime Error";
                  break;

                default:
                  // passed = testCase.expectedOutput.includes(
                  //   decode64(foundSubmission.stdout).trim(),
                  // );
                  passed = testCase.expectedOutput.some((exptout) => {
                    const parsedExpected = JSON.parse(exptout);
                    const parsedActual = JSON.parse(
                      decode64(foundSubmission.stdout).trim().toString(),
                    );

                    return (
                      parsedExpected.length === parsedActual.length &&
                      parsedExpected.every(
                        (v: any, i: any) => v === parsedActual[i],
                      )
                    );
                  });
                  actualOutput = decode64(foundSubmission.stdout);
              }
              return {
                ...testCase,
                passed,
                running: false,
                resultsAvailable: true,
                actualOutput,
              };
            }
            return testCase;
          });
          console.log(updatedTestCases);
          setFullTestCases(updatedTestCases);
        }
      });
    }
  }, [
    judge0Controller,
    ongoingCodeExecutions,
    executedSubmissions,
    fullTestCases,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ongoingCodeExecutions && ongoingCodeExecutions.length > 0) {
        console.log("Handling New Batch Checking");
        handleBatchSubmissions();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [ongoingCodeExecutions, handleBatchSubmissions]);

  return (
    <>
      <div className="flex flex-row-reverse mt-5 gap-3">
        <button
          type="button"
          className="rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
          onClick={handleSubmit}
          disabled={
            ongoingCodeExecutions ? ongoingCodeExecutions.length > 0 : false
          }
        >
          Submit Code
        </button>
        <AdminHoc currentUser={currentUser} currentRole={currentRole}>
          <button
            type="button"
            className="rounded-md bg-slate-600 dark:bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 dark:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 dark:focus-visible:outline-slate-400"
            onClick={() => {
              navigate(`/questions/${question.id}/edit`);
            }}
          >
            Edit Question
          </button>
        </AdminHoc>
      </div>
      <div className="mt-5">
        <div className="border rounded-lg shadow p-5">
          <h1 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
            Code Result
          </h1>
          <div className="flex flex-row flex-wrap gap-2">
            {fullTestCases &&
              fullTestCases.map((testCase, idx) => (
                <TestCase
                  key={`testCase-${testCase.questionId}-${testCase.testCaseNumber}`}
                  testCasePassed={testCase.passed}
                  input={testCase.input}
                  expectedOutput={testCase.expectedOutput}
                  actualOutput={testCase.actualOutput}
                  testCaseNumber={testCase.testCaseNumber}
                  isRunning={testCase.running}
                  hasResults={testCase.resultsAvailable}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeResult;
