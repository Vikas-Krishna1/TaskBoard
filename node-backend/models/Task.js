import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  duration: String,
  completed: { type: Boolean, default: false },
});

export default mongoose.model("Task", taskSchema);
