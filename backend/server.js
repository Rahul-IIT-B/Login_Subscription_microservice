// server.js
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const cluster = require("cluster");
const os = require("os");
const cors = require('cors');

function reloadEnv() {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
reloadEnv();
const bodyParser = require("body-parser");

// DB 
const { sequelize } = require("./models");

// Routes & middleware
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const postsRoutes = require("./routes/postsRoutes");
const errorHandler = require("./middleware/errorHandler");

if (cluster.isMaster) {
  const numCPUs = 1;
  console.log(`Master process running. Forking for ${numCPUs} CPUs...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(cors({
    origin: 'http://localhost:3001', // allow your frontend origin
    credentials: true
  }));

  app.use(bodyParser.json());

  // 3. Public routes
  app.use("/", authRoutes);
  app.use("/post", postRoutes);
  app.use("/posts", postsRoutes);

  app.use(errorHandler);

  // 6. Sync DB, then start server
  (async () => {
    try {
      await sequelize.sync({ logging: false });
      console.log("✅ Database synced");

      app.listen(process.env.PORT, () =>
        console.log(`🚀 Server running on port ${process.env.PORT}`)
      );
    } catch (err) {
      console.error("Failed to sync DB and connect MQ:", err);
      process.exit(1);
    }
  })();
}
