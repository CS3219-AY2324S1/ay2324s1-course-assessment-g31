import { useState } from "react";
import QuestionForm from "./components/QuestionForm";
import QuestionsList from "./components/QuestionsList";
import { Question } from "../../types/question";
import styles from "./QuestionsPage.module.css";

export default function QuestionsPage() {
  // TODO replace with useContext
  const [questionToEdit, setQuestionToEdit] = useState<Question>();
  return (
    <div className={styles.pageContainer}>
      <QuestionsList setQuestionToEdit={setQuestionToEdit} />
      <QuestionForm
        questionToEdit={questionToEdit}
        setQuestionToEdit={setQuestionToEdit}
      />
    </div>
  );
}
