import "dotenv/config";
import express from "express";
import http from "http";
import router from "./routes/index.js";
import redisClient from "./utils/redis/index.js";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schemas/index.js";

async function main() {
  const app = express();
  const server = http.createServer(app);

  await mongoose.connect(process.env.MONGODB_URI || "");
  console.log("🚀 Connected to MongoDB");

  await redisClient.connect();
  console.log("🚀 Connected to Redis");

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  );

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(router);

  server.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

main().catch((err) => console.error(err));
