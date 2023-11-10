import React from "react";
import { TSolution } from "../types/question";

interface ISolutionProps {
  solution: TSolution;
}

export default function Solution({ solution }: ISolutionProps) {
  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold">{solution.title}</h2>
      <span>{solution.language}</span>
      <p className="whitespace-pre my-5">{solution.description}</p>
      <p className="whitespace-pre bg-gray-100 font-mono">{solution.code}</p>
    </div>
  );
}
