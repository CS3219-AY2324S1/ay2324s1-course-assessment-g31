import QuestionForm from "./components/QuestionForm";
import QuestionsList from "./components/QuestionsList";

export default function QuestionsPage() {
  return (
    <div>
      <QuestionsList />
      <QuestionForm />
    </div>
  );
}
