import React from "react";
import { TSolution } from "../types/question";

interface ISolutionProps {
  solution: TSolution;
}

export default function Solution({ solution }: ISolutionProps) {
  return (
    <div>
      <h2>{solution.title}</h2>
      <span>{solution.language}</span>
      <p className="whitespace-pre">{solution.description}</p>
      <p className="whitespace-pre">{solution.code}</p>
    </div>
  );
}
