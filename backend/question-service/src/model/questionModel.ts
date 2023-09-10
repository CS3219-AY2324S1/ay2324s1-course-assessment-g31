import { Schema, model, connect } from "mongoose";

enum Complexity {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

enum Category {
  Strings = "Strings",
  DataStructures = "Data Structures",
  Algorithms = "Algorithms",
  BitManipulation = "Bit Manipulation",
  Databases = "Databases",
  Arrays = "Arrays",
  Brainteaser = "Brainteaser",
  Recursion = "Recursion",
}

export interface IQuestion {
  title: string;
  complexity: Complexity;
  category: Category[];
  description: string;
}

const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  complexity: { type: String, enum: Complexity, required: true },
  category: { type: [String], enum: Category, required: true },
  description: { type: String, required: true },
});

const Question = model<IQuestion>("Question", questionSchema);

export default Question;
