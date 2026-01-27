require("dotenv").config();
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const studentsRouter = require("./routes/students.router");

const { AuthController } = require("./auth/auth.controller");
const { authTokenGuard } = require("./auth/guard/authToken.guard");
const statusMonitor = require("express-status-monitor");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const logger = require("./logger/winston.logger");
const { roleGuard } = require("./auth/guard/role.guard");


const app = express();
const PORT = process.env.PORT || 3000;
app.use(compression());

const authController = new AuthController();

app.use(cors());
app.use(express.json());

app.post("/login", authController.login);
app.post("/registration", authController.registration);

app.use(authTokenGuard);

app.use("/api/students", studentsRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`API server running at http://localhost:${PORT}`);
  });
}

app.use(
  "/status",
  authTokenGuard,
  roleGuard(["ADMIN", "MODERATOR"]),
  statusMonitor()
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = { app };

