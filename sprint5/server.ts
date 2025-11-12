import http from "http";
import app from "./app.js"; // express app
import { initNotificationSocket } from "./utils/notificationSocket.js";
import { PORT } from "./lib/constants.js";

const server = http.createServer(app);
initNotificationSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
