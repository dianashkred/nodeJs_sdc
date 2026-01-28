require("dotenv").config();
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const statusMonitor = require("express-status-monitor");
const swaggerUi = require("swagger-ui-express");

const studentsRouter = require("./routes/students.router");
const swaggerSpec = require("./swagger");
const logger = require("./logger/winston.logger");

const { AuthController } = require("./auth/auth.controller");
const { authTokenGuard } = require("./auth/guard/authToken.guard");
const { roleGuard } = require("./auth/guard/role.guard");
const { UserRole } = require("./models/enums/UserRole.enum");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(cors());
app.use(express.json());

const authController = new AuthController();

app.post("/login", authController.login);
app.post("/registration", authController.registration);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(
  "/status",
  authTokenGuard,
  roleGuard([UserRole.ADMIN]),
  statusMonitor()
);

app.use(authTokenGuard);
app.use("/api/students", studentsRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`API server running at http://localhost:${PORT}`);
  });
}

module.exports = { app };
