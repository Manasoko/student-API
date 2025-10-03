import express from "express";
import "dotenv/config";
import routes from "./routes.js";
import mongoose from "mongoose";

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1", routes);

export default app;

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
    app.listen(port);
  })();
}
