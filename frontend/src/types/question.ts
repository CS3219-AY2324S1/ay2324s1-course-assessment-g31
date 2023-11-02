export enum ComplexityMap {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

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
  complexity: Complexity;
  category: Category[];
  description: string;
  id: number;
}
