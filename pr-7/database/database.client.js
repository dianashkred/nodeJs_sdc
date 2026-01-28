const { Pool } = require("pg");
const config = require("./config/pg-connection.config");

class DatabaseClient {
  static instance;
  pool;

  constructor() {
    this.pool = new Pool(config);
  }

  async connect() {
    if (this._connected) return;

    await this.pool.connect();
    this._connected = true;

   if (process.env.NODE_ENV !== "test") {
     this.pool.connect().then(() => {
      console.log("Connected to PostgreSQL database");
    });
    }
  }

  static getInstance() {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  async query(queryText, values) {
    await this.connect();
    return this.pool.query(queryText, values);
  }
}

module.exports = DatabaseClient;
