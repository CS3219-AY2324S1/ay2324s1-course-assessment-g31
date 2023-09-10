export enum ComplexityMap {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export type Complexity = `${ComplexityMap}`;

export enum CategoryMap {
  Strings = "Strings",
  DataStructures = "Data Structures",
  Algorithms = "Algorithms",
  BitManipulation = "Bit Manipulation",
  Databases = "Databases",
  Arrays = "Arrays",
  Brainteaser = "Brainteaser",
}

export type Category = `${CategoryMap}`;

export interface Question {
  title: string;
  complexity: Complexity;
  category: Category[];
  description: string;
  _id: string;
}
