// node-backend/models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  text: { type: String, default: "" }
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
