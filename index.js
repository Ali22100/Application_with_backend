import express from "express";
import mongoose from "mongoose";
import { User } from "./model/userSchema.js";

const app = express();
const PORT = 5000;

app.use(express.json());

// -----------------------------------
// MongoDB Connection
// -----------------------------------
const MONGODB_URI = "mongodb+srv://todo:todo@cluster0.qnzvjav.mongodb.net/";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -----------------------------------
// SIGNUP API
// -----------------------------------
app.post("api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // create new user
    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      message: "Signup successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------
// LOGIN API
// -----------------------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required!" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------
// ROOT ROUTE
// -----------------------------------
app.get("/", (req, res) => {
  res.json({
    message: "Server started successfully 🚀",
  });
});

// -----------------------------------
// START SERVER
// -----------------------------------
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
