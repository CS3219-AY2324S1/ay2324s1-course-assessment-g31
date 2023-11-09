import { useState } from "react";
import { useNavigate } from "react-router";

import { TSolution } from "../../../types/question";
import Solution from "../../../components/Solution";

interface ISolutionsProps {
  solutions: TSolution[];
  questionId: number;
}

export default function Solutions({ solutions, questionId }: ISolutionsProps) {
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

  return (
    <div>
      <button type="button" onClick={handleAddSolution}>
        Add Solution
      </button>
      {solutions.length === 0 && <h2>No Solutions Available</h2>}
      {solutions.length !== 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Language</td>
              </tr>
            </thead>
            <tbody>
              {solutions.map((solution, index) => (
                <tr>
                  <td>
                    <span
                      role="button"
                      tabIndex={index}
                      onKeyDown={() => setSelectedSolution(solution)}
                      onClick={() => setSelectedSolution(solution)}
                      className="underline text-blue-700 font-bold"
                    >
                      {solution.title}
                    </span>
                  </td>
                  <td>{solution.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedSolution && (
        <div>
          <button type="button" onClick={handleEditSolution}>
            Edit Solution
          </button>
          <Solution solution={selectedSolution} />
        </div>
      )}
    </div>
  );
}
