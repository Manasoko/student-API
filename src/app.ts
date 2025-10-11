import express from "express";
import "dotenv/config";
import { Sequelize } from "sequelize";

import sequelize from "./utils/database.js";
import { createRouter } from "./routes.js";
import "./models/student.js";

export const createApp = (sequelizeInstance: Sequelize = sequelize) => {
    const app = express();

    app.use(express.json());

    const studentRoutes = createRouter(sequelizeInstance);
    app.use("/api/v1", studentRoutes);

    return app;
};

const app = createApp();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV !== "test") {
    (async () => {
        try {
            await sequelize.authenticate();
            if (NODE_ENV !== "production") {
                await sequelize.sync();
            }
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    })();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
