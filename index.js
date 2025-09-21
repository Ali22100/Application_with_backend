import express from "express";
import mongoose from "mongoose";
import { Todo } from "./model/userSchema.js";// yahan import

const app = express();
const PORT = 5000;

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://todo:todo@cluster0.qnzvjav.mongodb.net/";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes

app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });
  const todo = await Todo.create({ title });
  res.status(201).json(todo);
});

app.put("/api/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Todo not found" });
  res.json(updated);
});

app.delete("/api/todos/:id", async (req, res) => {
  const deleted = await Todo.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo deleted" });
});


app.get("/", (req, res) => {
  res.json({
    message: "server start",
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
