import { Schema, model, connect } from 'mongoose';

enum Complexity {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export interface IQuestion {
  title: string;
  complexity: Complexity;
  description: string;
}

const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  complexity: { type: String, required: true },
  description: { type: String, required: true },
});

const Question = model<IQuestion>('Question', questionSchema);

export default Question;