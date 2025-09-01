import http from "http";
import SocketService from "./services/socket";

async function init() {
  const httpServer = http.createServer();
  const PORT = parseInt(process.env.PORT || "8000", 10);

  const socketService = new SocketService(httpServer);
  socketService.initListeners();

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Http server started at PORT: ${PORT}`);
  });
}

init();
