import { TSolution } from "../types/question";

interface ISolutionProps {
  solution: TSolution;
}

export default function Solution({ solution }: ISolutionProps) {
  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold">{solution.title}</h2>
      <span>{solution.language}</span>
      <p className="whitespace-pre my-3">{solution.description}</p>
      <p className="whitespace-pre bg-white border-gray-500 border p-1 font-mono">
        {solution.code}
      </p>
    </div>
  );
}
