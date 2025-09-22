import http from "http";
import SocketService from "./services/socket";
// import { startMessageConsumer } from "./services/kafka";

async function init() {
  const socketService = new SocketService();
  // startMessageConsumer();
  const PORT = parseInt(process.env.PORT || "8000", 10);

  const allowedOrigins = [
    "http://localhost:3000",
    `${process.env.FRONTEND_ORIGIN_URL}`,
  ];

  const httpServer = http.createServer((req, res) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // ✅ Handle preflight request
    if (req.method === "OPTIONS") {
      res.writeHead(204); // No content
      res.end();
      return;
    }

    // Health check route
    if (req.url === "/api/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Server is alive");
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
  socketService.io.attach(httpServer);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Http server started at PORT: ${PORT}`);
  });

  console.log("Initialize socket listeners");
  socketService.initListeners();
}

init();
