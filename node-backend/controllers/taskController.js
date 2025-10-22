import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";

// @desc Get all tasks for logged-in user
// @route GET /api/tasks
// @access Private
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ date: 1 });
  res.json(tasks);
});

// @desc Create new task
// @route POST /api/tasks
// @access Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, date, time, duration } = req.body;

  if (!title || !date) {
    res.status(400);
    throw new Error("Please provide a title and date");
  }

  const task = await Task.create({
    user: req.user.id,
    title,
    description,
    date,
    time,
    duration,
  });

  res.status(201).json(task);
});

// @desc Update a task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updated);
});

// @desc Delete a task
// @route DELETE /api/tasks/:id
// @access Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await task.deleteOne(); // ✅ Mongoose v7+ compatible
  res.json({ message: "Task removed" });
});
