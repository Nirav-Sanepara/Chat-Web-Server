import express from "express";
import http from "http";
function main() {
  const app = express();
  const server = http.createServer(app);

  server.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

main();
