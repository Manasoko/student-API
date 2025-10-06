import express from "express";
import "dotenv/config"

import studentRoutes from './routes.js';

const app = express();

app.use(express.json());

app.use("/api/v1", studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});