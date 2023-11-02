import React, { createContext, useCallback, useState, useMemo } from "react";
import { Question } from "../types/question";
import { Attempt } from "../types/history";

interface IQuestionViewContext {
  selectedAttempt: Attempt | undefined;
  selectedQuestion: Question | undefined;
  questionHistory: Attempt[];
  selectAttempt: (attempt: Attempt) => void;
  selectQuestion: (question: Question, history: Attempt[]) => void;
  unselectAll: () => void;
  unselectAttempt: () => void;
}

export const QuestionViewContext = createContext<IQuestionViewContext>({
  selectedAttempt: undefined,
  selectedQuestion: undefined,
  questionHistory: [],
  selectAttempt: () => {},
  selectQuestion: () => {},
  unselectAll: () => {},
  unselectAttempt: () => {},
});

export function QuestionViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt>();
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [questionHistory, setQuestionHistory] = useState<Attempt[]>([]);

  const selectQuestion = useCallback(
    (question: Question, history: Attempt[]) => {
      setSelectedAttempt(undefined);
      setSelectedQuestion(question);
      setQuestionHistory(history);
    },
    [],
  );

  const selectAttempt = useCallback((attempt: Attempt) => {
    setSelectedAttempt(attempt);
  }, []);

  const unselectAttempt = useCallback(() => {
    setSelectedAttempt(undefined);
  }, []);

  const unselectAll = useCallback(() => {
    setSelectedAttempt(undefined);
    setSelectedQuestion(undefined);
    setQuestionHistory([]);
  }, []);

  const value = useMemo(() => {
    return {
      selectedAttempt,
      selectedQuestion,
      questionHistory,
      selectAttempt,
      selectQuestion,
      unselectAll,
      unselectAttempt,
    };
  }, [
    selectedAttempt,
    selectedQuestion,
    questionHistory,
    selectAttempt,
    selectQuestion,
    unselectAll,
    unselectAttempt,
  ]);

  return (
    <QuestionViewContext.Provider value={value}>
      {children}
    </QuestionViewContext.Provider>
  );
}
