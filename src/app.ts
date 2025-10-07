import express from "express";
import "dotenv/config";

import sequelize from "./utils/database.js";
import studentRoutes from "./routes.js";

import "./models/student.js"

const app = express();

app.use(express.json());

app.use("/api/v1", studentRoutes);

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
