import History from "./components/History";
import QuestionAndSolution from "./components/QuestionAndSolution";

export default function QuestionsPage() {
  return (
    <div className="flex flex-row">
      <QuestionAndSolution />
      <History />
    </div>
  );
}
