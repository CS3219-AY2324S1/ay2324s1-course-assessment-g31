import { useState } from "react";
import { useNavigate } from "react-router";

import { TSolution } from "../../../types/question";
import Solution from "../../../components/Solution";

interface ISolutionsProps {
  solutions: TSolution[];
  questionId: number;
  refetch: () => void;
}

export default function Solutions({
  solutions,
  questionId,
  refetch,
}: ISolutionsProps) {
  const [selectedSolution, setSelectedSolution] = useState<TSolution>(
    solutions[0],
  );
  const navigate = useNavigate();

  const handleAddSolution = () => {
    navigate(`/questions/solution/form?qid=${questionId}`);
  };

  const handleEditSolution = () => {
    if (selectedSolution) {
      navigate(
        `/questions/solution/form?qid=${selectedSolution.questionId}&sid=${selectedSolution.id}`,
      );
    }
  };

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDeleteSolution = async () => {
    setIsDeleting(true);
    if (window.confirm("Are you sure you want to delete this question")) {
      try {
        const response = await fetch(
          `http://localhost:5003/solution/${selectedSolution.id}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw Error(data.error);
        } else {
          setIsDeleting(false);
          refetch();
        }
      } catch (err: any) {
        window.alert(err.message);
      }
    }
    setIsDeleting(false);
  };

  return (
    <div>
      <div className="border-b-2 border-indigo-600 my-3 py-3 flex flex-row items-start gap-5">
        {solutions.length === 0 && <h2>No Solutions Available</h2>}
        {solutions.length !== 0 && (
          <table className="border-2 border-indigo-600 w-3/4">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <td className="font-bold">Title</td>
                <td className="font-bold">Language</td>
              </tr>
            </thead>
            <tbody>
              {solutions.map((solution, index) => (
                <tr
                  className={`${
                    selectedSolution.id === solution.id ? "bg-slate-300" : ""
                  }`}
                  role="button"
                  tabIndex={index}
                  onKeyDown={() => setSelectedSolution(solution)}
                  onClick={() => setSelectedSolution(solution)}
                >
                  <td className="text-indigo-700 font-semibold">
                    {solution.title}
                  </td>
                  <td font-semibold>{solution.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          className="block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          onClick={handleAddSolution}
        >
          Add
        </button>
      </div>
      {selectedSolution && (
        <div>
          <div className="flex flex-row gap-2">
            <button
              className="block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={handleEditSolution}
            >
              Edit
            </button>
            <button
              className="block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={handleDeleteSolution}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
          <Solution solution={selectedSolution} />
        </div>
      )}
    </div>
  );
}
