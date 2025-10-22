import Task from "../models/taskModel.js";
import { sendNotification } from "../services/notificationService.js";

// Get tasks
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

// Create new task
export const createTask = async (req, res) => {
  const { title, description, date, time, duration } = req.body;
  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    date,
    time,
    duration,
  });
  await sendNotification({ message: `New task created: ${title}` });
  res.status(201).json(task);
};

// Update task
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await sendNotification({ message: `Task updated: ${updated.title}` });
  res.json(updated);
};

// Delete task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  await task.deleteOne();
  await sendNotification({ message: `Task deleted: ${task.title}` });
  res.json({ message: "Task removed" });
};
