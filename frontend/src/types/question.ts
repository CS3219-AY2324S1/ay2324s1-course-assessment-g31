/**
 * @deprecated Use Difficulties
 */
export enum ComplexityMap {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export const Difficulties = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof Difficulties)[number];

/**
 * @deprecated Use Difficulty
 */
export type Complexity = `${ComplexityMap}`;

export enum CategoryMap {
  Strings = "Strings",
  DataStructures = "DataStructures",
  Algorithms = "Algorithms",
  BitManipulation = "BitManipulation",
  Databases = "Databases",
  Arrays = "Arrays",
  Brainteaser = "Brainteaser",
  Recursion = "Recursion",
}

export type Category = `${CategoryMap}`;

export interface Question {
  title: string;
  difficulty: Difficulty;
  category: Category[];
  description: string;
  example: string;
  constraint: string;
  popularity: number;
  id: number;
  solutions: TSolution[];
}

export type TSolution = {
  id: string;
  questionId: number;
  title: string;
  description: string;
  code: string;
  language: string;
};
