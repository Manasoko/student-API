import request from "supertest";
import type { Express } from "express";
import { setupTestDatabase, teardownTestDatabase, clearDatabase } from "./utils/test-helpers";
import type { TestDatabase } from "./utils/test-helpers";
import sequelize from "../src/utils/database";
import app from "../src/app";

describe("API Tests", () => {
    let app: Express;
    let testDB: TestDatabase;

    beforeAll(async () => {
        testDB = await setupTestDatabase()
    });

    afterAll(async () => {
        await teardownTestDatabase(testDB);
    });

    beforeEach(async () => {
        await clearDatabase(testDB.sequelize);
    });
});