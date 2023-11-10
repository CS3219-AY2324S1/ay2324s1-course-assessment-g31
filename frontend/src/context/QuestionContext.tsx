import { langs } from "@uiw/codemirror-extensions-langs";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FullQuestion } from "../interfaces/questionService/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../interfaces/questionService/fullQuestion/updateDTO";
import { QuestionTestCase } from "../interfaces/questionService/questionTestCase/object";
import { QuestionUpdateDTO } from "../interfaces/questionService/question/updateDTO";
import { NotificationContext } from "./NotificationContext";
import QuestionController from "../controllers/question/question.controller";
import { encode64, decode64 } from "../util/base64";

export type CodingLanguage = keyof typeof langs;

const defaultInitialCode = "// Default Code //";
const defaultRunnerCode = "// Default Code //";
const defaultSelectedLanguage = "java" as CodingLanguage;

enum themeKeys {
  "basic",
  "duotone",
  "github",
  "material",
  "solarized",
  "white",
  "xcode",
}

export type CodingTheme = keyof typeof themeKeys;

const defaultSelectedTheme = "basic";

interface QuestionProviderProps {
  children: ReactNode;
}

interface QuestionContextType {
  questions: FullQuestion[];
  question: FullQuestion;
  selectedLanguage: CodingLanguage;
  selectedTheme: CodingTheme;
  initialCode: string;
  runnerCode: string;
  controller: QuestionController;
  setSelectedLanguage: (selectedLanguage: CodingLanguage) => void;
  setSelectedTheme: (selectedTheme: CodingTheme) => void;
  setQuestionId: (id: number) => void;
  saveNewInitialCode: (lang: string, newCode: string) => void;
  saveNewRunnerCode: (lang: string, newCode: string) => void;
  saveNewTestCases: (testCases: QuestionTestCase[]) => void;
  updateQuestionData: (questionData: QuestionUpdateDTO) => void;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: [] as unknown as FullQuestion[],
  question: null as unknown as FullQuestion,
  selectedLanguage: defaultSelectedLanguage,
  selectedTheme: defaultSelectedTheme,
  initialCode: defaultInitialCode,
  runnerCode: defaultRunnerCode,
  controller: null as unknown as QuestionController,
  setSelectedLanguage: (_selectedLanguage: CodingLanguage) => {},
  setSelectedTheme: (_selectedTheme: CodingTheme) => {},
  setQuestionId: (_id: number) => {},
  saveNewInitialCode: (_lang: string, _newCode: string) => {},
  saveNewRunnerCode: (_lang: string, _newCode: string) => {},
  saveNewTestCases: (_testCases: QuestionTestCase[]) => {},
  updateQuestionData: (_questionData: QuestionUpdateDTO) => {},
});

export function QuestionProvider({ children }: QuestionProviderProps) {
  const { addNotification } = useContext(NotificationContext);
  const [questions, setQuestions] = useState<FullQuestion[]>(
    [] as unknown as FullQuestion[],
  );
  const [question, setQuestion] = useState<FullQuestion>(
    null as unknown as FullQuestion,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<CodingLanguage>(
    defaultSelectedLanguage,
  );
  const [selectedTheme, setSelectedTheme] =
    useState<CodingTheme>(defaultSelectedTheme);
  const [initialCode, setInitialCode] = useState<string>(defaultInitialCode);
  const [runnerCode, setRunnerCode] = useState<string>(defaultRunnerCode);
  const [questionId, setQuestionId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const controller = useMemo(() => new QuestionController(), []);

  const loadQuestions = useCallback(async () => {
    const res = await controller.readQuestions();
    if (res && res.data) {
      setQuestions(res.data);
    }
  }, [controller]);

  const saveNewInitialCode = useCallback(
    async (lang: string, newCode: string) => {
      if (loading || !question) return;
      const data: Partial<FullQuestionUpdateDTO> = {
        initialCodes: question.initialCodes.map((x) => {
          if (x.language === lang) {
            return {
              ...x,
              code: encode64(newCode),
            };
          }
          return {
            ...x,
            code: encode64(x.code),
          };
        }),
      };

      try {
        const res = await controller.updateQuestion(question.id, data);
        if (res) {
          addNotification({
            type: "success",
            message: "Initial Codes have been updated successfully",
          });
          setQuestion(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [loading, controller, question, addNotification],
  );

  const saveNewRunnerCode = useCallback(
    async (lang: string, newCode: string) => {
      if (loading || !question) return;
      const data: Partial<FullQuestionUpdateDTO> = {
        runnerCodes: question.runnerCodes.map((x) => {
          if (x.language === lang) {
            return {
              ...x,
              code: encode64(newCode),
            };
          }
          return {
            ...x,
            code: encode64(x.code),
          };
        }),
      };

      try {
        const res = await controller.updateQuestion(question.id, data);
        if (res) {
          addNotification({
            type: "success",
            message: "Runner Codes have been updated successfully",
          });
          setQuestion(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [loading, controller, question, addNotification],
  );

  const saveNewTestCases = useCallback(
    async (testCases: QuestionTestCase[]) => {
      if (loading || !question) return;
      const data: Partial<FullQuestionUpdateDTO> = {
        testCases,
      };

      try {
        const res = await controller.updateQuestion(question.id, data);
        if (res) {
          addNotification({
            type: "success",
            message: "Test Cases have been updated successfully",
          });
          setQuestion(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [loading, controller, question, addNotification],
  );

  const updateQuestionData = useCallback(
    async (dto: QuestionUpdateDTO) => {
      if (loading || !dto) return;

      try {
        const res = await controller.updateQuestion(question.id, dto);
        if (res) {
          addNotification({
            type: "success",
            message: "Question have been updated successfully",
          });
          setQuestion(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [loading, controller, question, addNotification],
  );

  const value = useMemo(
    () => ({
      questions,
      question,
      selectedLanguage,
      selectedTheme,
      initialCode,
      runnerCode,
      controller,
      setSelectedLanguage,
      setSelectedTheme,
      setQuestionId,
      saveNewInitialCode,
      saveNewRunnerCode,
      saveNewTestCases,
      updateQuestionData,
    }),
    [
      questions,
      question,
      selectedLanguage,
      selectedTheme,
      initialCode,
      runnerCode,
      controller,
      setSelectedLanguage,
      setSelectedTheme,
      setQuestionId,
      saveNewInitialCode,
      saveNewRunnerCode,
      saveNewTestCases,
      updateQuestionData,
    ],
  );

  const loadQuestionData = useCallback(() => {
    if (!questionId) return;
    controller
      .getQuestion(questionId)
      .then((res) => {
        if (res) {
          setQuestion(res.data);
        }
      })
      .catch((err) => {});
  }, [controller, questionId]);

  useEffect(() => {
    setLoading(true);
    loadQuestionData();
    setLoading(false);
  }, [loadQuestionData]);

  const loadInitialCode = useCallback(async () => {
    if (loading || !question) return;
    const foundCode = question.initialCodes.find(
      (x) => x.language === selectedLanguage,
    );
    setInitialCode(foundCode ? decode64(foundCode.code) : defaultInitialCode);
  }, [loading, question, selectedLanguage]);

  const loadRunnerCode = useCallback(async () => {
    if (loading || !question) return;
    const foundCode = question.runnerCodes.find(
      (x) => x.language === selectedLanguage,
    );
    setRunnerCode(foundCode ? decode64(foundCode.code) : defaultRunnerCode);
  }, [loading, question, selectedLanguage]);

  useEffect(() => {
    setLoading(true);
    loadInitialCode();
    setLoading(false);
  }, [loadInitialCode]);

  useEffect(() => {
    setLoading(true);
    loadRunnerCode();
    setLoading(false);
  }, [loadRunnerCode]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}
