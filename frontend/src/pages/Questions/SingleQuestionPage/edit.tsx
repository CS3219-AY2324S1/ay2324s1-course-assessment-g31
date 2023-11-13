import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import PageContainer from "../../../components/container/Page";
import UpdatingCodingSpace from "../../../components/UpdatingCodingSpace";
import { QuestionContext } from "../../../context/QuestionContext";
import QuestionForm from "../../QuestionForm/QuestionForm";

export default function EditSingleQuestionPage() {
  const { questionId } = useParams();
  const { setQuestionId } = useContext(QuestionContext);

  useEffect(() => {
    if (questionId) {
      setQuestionId(parseInt(questionId, 10));
    }
  }, [questionId, setQuestionId]);

  return (
    <PageContainer>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 xl:grid-cols-3 xl:gap-x-12">
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 xl:col-span-3">
          <QuestionForm />
          <UpdatingCodingSpace />
        </div>
      </div>
    </PageContainer>
  );
}
