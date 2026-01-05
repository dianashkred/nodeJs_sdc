require("dotenv").config();

const express = require("express");
const cors = require("cors");

const studentsRouter = require("./routes/students.router");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/students", studentsRouter);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
