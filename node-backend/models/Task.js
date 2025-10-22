import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    date: {
      type: String,
      required: true,
    },
    time: String,
    duration: String, // added for new feature
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
