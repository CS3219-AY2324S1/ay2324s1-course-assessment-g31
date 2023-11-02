import QuestionsList from "./components/QuestionsList";
import styles from "./QuestionsPage.module.css";
import { QuestionViewProvider } from "../../context/QuestionViewContext";
import ViewWindow from "./components/ViewWindow";
import History from "./components/History";

export default function QuestionsPage() {
  return (
    <div className={styles.pageContainer}>
      {/* <QuestionsToProfileLink /> */}
      <QuestionViewProvider>
        <QuestionsList />
        <div className="flex flex-col">
          <History />
          <ViewWindow />
        </div>
      </QuestionViewProvider>
    </div>
  );
}
