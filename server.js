// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");

// Create Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the Student model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  major: String,
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});
const Student = mongoose.model("Student", studentSchema);

// GET /students: Fetch all students
app.get("/studentDB", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving students" });
  }
});

// GET /students/:id: Fetch a single student by id
app.get("/studentDB/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving student" });
  }
});

// POST /student-db: Add a new student
app.post("/studentDB", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Error adding student" });
  }
});

// PUT /students/:id: Update a student by id
app.put("/studentDB/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
});

// DELETE /students/:id: Delete a student by id
app.delete("/studentDB/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (student) {
      res.json({ message: "Student deleted successfully" });
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
