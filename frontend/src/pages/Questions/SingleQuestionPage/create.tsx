import PageContainer from "../../../components/container/Page";
import CreateQuestionForm from "../../../components/CreateQuestionForm";

export default function CreateSingleQuestionPage() {
  return (
    <PageContainer>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 xl:grid-cols-3 xl:gap-x-12">
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 xl:col-span-3">
          <CreateQuestionForm />
        </div>
      </div>
    </PageContainer>
  );
}
