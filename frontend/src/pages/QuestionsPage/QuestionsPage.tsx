import History from "./components/History";
import QuestionAndSolution from "./components/QuestionAndSolution";

export default function QuestionsPage() {
  return (
    <div className="flex flex-row justify-center my-8 h-full w-full min-w-[800px] p-2 bg-gray-100">
      <QuestionAndSolution />
      <History />
    </div>
  );
}
