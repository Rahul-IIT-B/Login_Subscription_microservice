// server.js
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const cluster = require("cluster");
const os = require("os");

function reloadEnv() {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
reloadEnv();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const enforceSSL = require("express-sslify");

// DB & MQ
const { sequelize } = require("./models");
const { connect: connectMQ } = require("./config/rabbitmq");

// Routes & middleware
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const errorHandler = require("./middleware/errorHandler");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
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

  // 1. Security
  app.use(helmet());
  if (process.env.NODE_ENV === "production") {
    app.use(enforceSSL.HTTPS({ trustProtoHeader: true }));
  }

  // 2. Body parser
  app.use(bodyParser.json());

  // 3. Public routes
  app.use("/auth", authRoutes);
  app.use("/plans", planRoutes);

  // 4. Protected routes
  app.use("/subscriptions", subscriptionRoutes);

  // 5. Error handler (last middleware)
  app.use(errorHandler);

  // 6. Sync DB, connect MQ, schedule expiry, then start server
  (async () => {
    try {
      await sequelize.sync({ logging: false });
      console.log("✅ Database synced");

      // Expire logic
      const { expireSubscriptions } = require("./services/subscriptionService");
      expireSubscriptions();
      setInterval(expireSubscriptions, 1000 * 60 * 60);

      // RabbitMQ
      connectMQ()
        .then(() => console.log("✅ RabbitMQ connected"))
        .catch((err) => console.error("❌ RabbitMQ connection failed:", err));

      app.listen(process.env.PORT, () =>
        console.log(`🚀 Server running on port ${process.env.PORT}`)
      );
    } catch (err) {
      console.error("Failed to sync DB and connect MQ:", err);
      process.exit(1);
    }
  })();
}
