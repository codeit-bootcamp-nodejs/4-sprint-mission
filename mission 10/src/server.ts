import { app, server } from "./app";
import { PORT } from "./lib/constants";

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});