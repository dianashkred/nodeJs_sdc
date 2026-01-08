const { Pool } = require("pg");
const config = require("./config/pg-connection.config");

class DatabaseClient {
  static instance;
  pool;

  constructor() {
    this.pool = new Pool(config);

    this.pool
      .connect()
      .then(() => {
        console.log("Connected to PostgreSQL database");
      })
      .catch((err) => {
        console.error("Failed to connect to PostgreSQL:", err);
      });
  }

  static getInstance() {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  async query(queryText, values) {
    return this.pool.query(queryText, values);
  }
}

module.exports = DatabaseClient;
