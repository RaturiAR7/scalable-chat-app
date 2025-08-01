import http from "http";
import SocketService from "./services/socket";

async function init() {
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = parseInt(process.env.PORT || "8000", 10); // <-- Fix here
  socketService.io.attach(httpServer);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Http server started at PORT: ${PORT}`);
  });

  console.log("Initialize socket listeners");
  socketService.initListeners();
}

init();
