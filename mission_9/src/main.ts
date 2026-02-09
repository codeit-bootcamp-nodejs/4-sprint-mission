import "dotenv/config";
import { httpServer } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}..`));
