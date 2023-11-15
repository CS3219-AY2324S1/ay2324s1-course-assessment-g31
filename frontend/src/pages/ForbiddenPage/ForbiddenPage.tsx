import { Link } from "react-router-dom";
import PageContainer from "../../components/container/Page";

function ForbiddenPage() {
  return (
    <PageContainer>
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">403</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          You are Forbidden
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default ForbiddenPage;
