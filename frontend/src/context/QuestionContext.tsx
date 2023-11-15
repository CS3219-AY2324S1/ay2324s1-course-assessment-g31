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

import HistoryController from "../controllers/history/history.controller";
import QuestionController from "../controllers/question/question.controller";
import { History } from "../interfaces/historyService/history/object";
import { FullQuestion } from "../interfaces/questionService/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../interfaces/questionService/fullQuestion/updateDTO";
import { Query } from "../interfaces/questionService/query";
import { QuestionUpdateDTO } from "../interfaces/questionService/question/updateDTO";
import {
  QuestionSolutionUpdateDTO,
  QuestionSolutionUpdateDTOs,
} from "../interfaces/questionService/questionSolution/updateDTO";
import { QuestionTestCase } from "../interfaces/questionService/questionTestCase/object";
import { decode64, encode64 } from "../util/base64";
import { useAuth } from "./AuthContext";
import { NotificationContext } from "./NotificationContext";

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
  solutionCodes: QuestionSolutionUpdateDTO[];
  questionHistories: History[];
  controller: QuestionController;
  setSelectedLanguage: (selectedLanguage: CodingLanguage) => void;
  setSelectedTheme: (selectedTheme: CodingTheme) => void;
  setQuestionId: (id: number) => void;
  setHistoryId: (id: string) => void;
  saveNewInitialCode: (lang: string, newCode: string) => void;
  saveNewRunnerCode: (lang: string, newCode: string) => void;
  saveNewTestCases: (testCases: QuestionTestCase[]) => void;
  saveNewSolutionCodes: (solutionCodes: QuestionSolutionUpdateDTO[]) => void;
  updateQuestionData: (questionData: QuestionUpdateDTO) => void;
  setQuestionQuery: React.Dispatch<
    React.SetStateAction<Partial<Query<FullQuestion>>>
  >;
}

export const QuestionContext = createContext<QuestionContextType>({
  questions: [] as unknown as FullQuestion[],
  question: null as unknown as FullQuestion,
  selectedLanguage: defaultSelectedLanguage,
  selectedTheme: defaultSelectedTheme,
  initialCode: defaultInitialCode,
  runnerCode: defaultRunnerCode,
  solutionCodes: [],
  questionHistories: [],
  controller: null as unknown as QuestionController,
  setSelectedLanguage: (_selectedLanguage: CodingLanguage) => {},
  setSelectedTheme: (_selectedTheme: CodingTheme) => {},
  setQuestionId: (_id: number) => {},
  setHistoryId: (_id: string) => {},
  saveNewInitialCode: (_lang: string, _newCode: string) => {},
  saveNewRunnerCode: (_lang: string, _newCode: string) => {},
  saveNewTestCases: (_testCases: QuestionTestCase[]) => {},
  saveNewSolutionCodes: (_solutionCodes: QuestionSolutionUpdateDTO[]) => {},
  updateQuestionData: (_questionData: QuestionUpdateDTO) => {},
  setQuestionQuery: () => {},
});

export function QuestionProvider({ children }: QuestionProviderProps) {
  const { addNotification } = useContext(NotificationContext);
  const [questions, setQuestions] = useState<FullQuestion[]>(
    [] as unknown as FullQuestion[],
  );
  const [questionHistories, setQuestionHistories] = useState<History[]>(
    [] as unknown as History[],
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
  const [solutionCodes, setSolutionCodes] = useState<
    QuestionSolutionUpdateDTO[]
  >([]);
  const [questionId, setQuestionId] = useState<number>();
  const [historyId, setHistoryId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [questionQuery, setQuestionQuery] = useState<
    Partial<Query<FullQuestion>>
  >({});

  const { currentUser } = useAuth();

  const controller = useMemo(() => new QuestionController(), []);
  const historyController = useMemo(() => new HistoryController(), []);

  const loadHistory = useCallback(async () => {
    if (currentUser) {
      const res = await historyController.getUserHistory(currentUser.uid);
      if (res && res.data) {
        setQuestionHistories(res.data);
      }
    }
  }, [historyController, currentUser]);

  const loadQuestions = useCallback(async () => {
    console.log(questionQuery);
    const res = await controller.getQuestions(questionQuery);
    if (res && res.data) {
      console.log(res.data.data);
      setQuestions(res.data.data);
    } else {
      console.log(res.errors);
    }
  }, [controller, questionQuery]);

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
        if (res.success && res.data) {
          addNotification({
            type: "success",
            message: "Initial Codes have been updated successfully",
          });
          setQuestion(res.data.data);
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
        if (res.success && res.data) {
          addNotification({
            type: "success",
            message: "Runner Codes have been updated successfully",
          });
          setQuestion(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [loading, controller, question, addNotification],
  );

  const saveNewSolutionCodes = useCallback(
    async (newSolutionCodes: QuestionSolutionUpdateDTO[]) => {
      if (loading || !question) return;

      const data: QuestionSolutionUpdateDTOs = {
        solutions: newSolutionCodes.map((x) => ({
          ...x,
          code: encode64(x.code),
        })),
      };

      try {
        const res = await controller.updateQuestion(question.id, data);
        if (res.success && res.data) {
          addNotification({
            type: "success",
            message: "Solution Codes have been updated successfully",
          });
          console.log(res.data.data);
          setQuestion(res.data.data);
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
        if (res.success && res.data) {
          addNotification({
            type: "success",
            message: "Test Cases have been updated successfully",
          });
          setQuestion(res.data.data);
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
        if (res.success && res.data) {
          addNotification({
            type: "success",
            message: "Question have been updated successfully",
          });
          setQuestion(res.data.data);
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
      solutionCodes,
      questionHistories,
      controller,
      setSelectedLanguage,
      setSelectedTheme,
      setQuestionId,
      setHistoryId,
      saveNewInitialCode,
      saveNewRunnerCode,
      saveNewTestCases,
      saveNewSolutionCodes,
      updateQuestionData,
      setQuestionQuery,
    }),
    [
      questions,
      question,
      selectedLanguage,
      selectedTheme,
      initialCode,
      runnerCode,
      solutionCodes,
      questionHistories,
      controller,
      setSelectedLanguage,
      setSelectedTheme,
      setQuestionId,
      setHistoryId,
      saveNewInitialCode,
      saveNewRunnerCode,
      saveNewTestCases,
      saveNewSolutionCodes,
      updateQuestionData,
      setQuestionQuery,
    ],
  );

  const loadQuestionData = useCallback(() => {
    if (!questionId) return;
    controller
      .getQuestionById(questionId)
      .then((res) => {
        if (res.success && res.data) {
          setQuestion(res.data.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
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
    console.log(selectedLanguage);
    if (historyId) {
      const history = await historyController.getHistory(historyId);
      if (history.success && history.data) {
        setInitialCode(decode64(history.data.code));
      } else {
        setInitialCode(
          foundCode ? decode64(foundCode.code) : defaultInitialCode,
        );
      }
    } else {
      setInitialCode(foundCode ? decode64(foundCode.code) : defaultInitialCode);
    }
  }, [loading, question, selectedLanguage, historyId, historyController]);

  const loadRunnerCode = useCallback(async () => {
    if (loading || !question) return;
    const foundCode = question.runnerCodes.find(
      (x) => x.language === selectedLanguage,
    );
    setRunnerCode(foundCode ? decode64(foundCode.code) : defaultRunnerCode);
  }, [loading, question, selectedLanguage]);

  const loadSolutionCodes = useCallback(async () => {
    if (loading || !question) return;
    setSolutionCodes(
      question.solutions
        .filter((x) => x.language === selectedLanguage)
        .map((y) => ({ ...y, code: decode64(y.code) })),
    );
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
    loadHistory();
  }, [loadQuestions, loadHistory]);

  useEffect(() => {
    loadSolutionCodes();
  }, [loadSolutionCodes]);

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}
