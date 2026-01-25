require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const expressStatusMonitor = require('express-status-monitor');
const express = require("express");
const cors = require("cors");

const studentsRouter = require("./routes/students.router");

const { AuthController } = require("./auth/auth.controller");
const { authTokenGuard } = require("./auth/guard/authToken.guard");

const app = express();
const PORT = process.env.PORT || 3000;

const authController = new AuthController();

app.use(cors());
app.use(express.json());

app.post("/login", authController.login);
app.post("/registration", authController.registration);

app.use(authTokenGuard);

app.use("/api/students", studentsRouter);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});


app.use(expressStatusMonitor());
app.get('/status', expressStatusMonitor());



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
