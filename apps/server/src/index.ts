import http from "http";
import SocketService from "./services/socket";
// import { startMessageConsumer } from "./services/kafka";

async function init() {
  const socketService = new SocketService();
  // startMessageConsumer();
  const PORT = parseInt(process.env.PORT || "8000", 10); // <-- Fix here

  const httpServer = http.createServer((req, res) => {
    ////Health check route
    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Server is alive"); // ✅ Health check
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });
  socketService.io.attach(httpServer);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Http server started at PORT: ${PORT}`);
  });

  console.log("Initialize socket listeners");
  socketService.initListeners();
}

init();
