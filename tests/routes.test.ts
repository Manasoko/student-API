import request from "supertest";
import type { Express } from "express";
import {
    setupTestDatabase,
    teardownTestDatabase,
    clearDatabase,
} from "./utils/test-helpers";
import { createApp } from "../src/app";


describe("API Tests", () => {
    let app: Express;

    beforeAll(async () => {
        const testSequelize = await setupTestDatabase();
        app = createApp(testSequelize);
    }, 60000);

    afterAll(async () => {
        await teardownTestDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe("GET api/v1/healthcheck", () => {
        it("should have health status", async () => {
            const response = await request(app)
                .get("/api/v1/healthcheck")
                .expect(200);

            expect(response.body).toHaveProperty("uptime");
            expect(response.body).toHaveProperty("timestamp");
        });
    });

    describe("GET api/v1/students", () => {
        it("should return empty array when no students", async () => {
            const response = await request(app)
                .get("/api/v1/students")
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it("should return all students", async () => {
            const students = [
                { name: "Student 1", age: 20, course: "Course 1" },
                { name: "Student 2", age: 21, course: "Course 2" },
                { name: "Student 3", age: 22, course: "Course 3" },
            ];

            for (const student of students) {
                await request(app).post("/api/v1/student").send(student);
            }

            const response = await request(app)
                .get("/api/v1/students")
                .expect(200);

            expect(response.body).toHaveLength(3);
            expect(response.body[0]).not.toHaveProperty("createdAt");
            expect(response.body[0]).not.toHaveProperty("updatedAt");
        });
    });

    describe("POST api/v1/student", () => {
        it("should create a new student", async () => {
            const newStudent = {
                name: "John Doe",
                age: 22,
                course: "Computer Science",
            };

            const response = await request(app)
                .post("/api/v1/student")
                .send(newStudent)
                .expect(201);

            expect(response.body).toHaveProperty(
                "message",
                "Created Successfully"
            );
            expect(response.body.student).toMatchObject(newStudent);
        });

        it("should return 400 if some values are missing", async () => {
            const newStudent = {
                name: "John Doe",
                age: 21,
            };
            const response = await request(app)
                .post("/api/v1/student")
                .send(newStudent)
                .expect(400);
            expect(response.body.message).toBe(
                "Missing required fields: name, age, course"
            );
        });
    });

    describe("GET api/v1/student/:id", () => {
        it("should return a student", async () => {
            const newStudent = {
                name: "John Doe",
                age: 22,
                course: "Computer Science",
            };

            const createRes = await request(app)
                .post("/api/v1/student")
                .send(newStudent);

            const studentId = createRes.body.student.id;
            const response = await request(app).get(
                `/api/v1/student/${studentId}`
            );

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(newStudent);
        });

        it("should return 404 if student not found", async () => {
            const response = await request(app).get("/api/v1/student/9999");
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(
                "Student not found in the database"
            );
        });
    });

    describe("PATCH /student/:id", () => {
        it("should update a studen", async () => {
            const newStudent = {
                name: "John Doe",
                age: 22,
                course: "Computer Science",
            };

            const createRes = await request(app)
                .post("/api/v1/student")
                .send(newStudent);

            const studentId = createRes.body.student.id;

            const updatedStudent = {
                name: "Jane Doe",
                age: 23,
                course: "Mathematics",
            };

            const patchRes = await request(app)
                .patch(`/api/v1/student/${studentId}`)
                .send(updatedStudent)
                .expect(200);

            expect(patchRes.body.student).toMatchObject(updatedStudent);
        });

        it("should update partially", async () => {
            const createRes = await request(app).post("/api/v1/student").send({
                name: "John Doe",
                age: 22,
                course: "Computer Science",
            });

            const studentId = createRes.body.student.id;

            const patchRes = await request(app)
                .patch(`/api/v1/student/${studentId}`)
                .send({age: 21})
                .expect(200);

            expect(patchRes.body.student.age).toBe(21);
            expect(patchRes.body.student.name).toBe("John Doe");
        });

        it("should return 404 if student not found", async () => {
            const patchRes = await request(app).patch(`/api/v1/student/999`).send({age: 21});

            expect(patchRes.status).toBe(404);
            expect(patchRes.body.message).toBe("Student not found in the database");
        });

        it("should return 400 if no value is provided", async () => {
             const createRes = await request(app).post("/api/v1/student").send({
                name: "John Doe",
                age: 22,
                course: "Computer Science",
            });

            const studentId = createRes.body.student.id;

            const patchRes = await request(app)
                .patch(`/api/v1/student/${studentId}`);

            expect(patchRes.status).toBe(400);
            expect(patchRes.body.message).toBe("No fields provided to update");
        })
    });

    describe("DELETE /student/:id", () => {
        it("should return 404 if student not found", async () => {
            const delRes = await request(app).delete(`/api/v1/student/999`);

            expect(delRes.status).toBe(404);
            expect(delRes.body.message).toBe("Student not found");
        });

        it("should return 200 if student is deleted", async () => {
            const createRes = await request(app).post("/api/v1/student").send({
                name: "John Doe",
                age: 22,
                course: "Computer Science",
            });

            const studentId = createRes.body.student.id;

            const delRes = await request(app).del(`/api/v1/student/${studentId}`)

            expect(delRes.body.message).toBe("Deleted successfully");

            const getRes = await request(app).get(
                `/api/v1/student/${studentId}`
            );

            expect(getRes.status).toBe(404);
            expect(getRes.body.message).toBe(
                "Student not found in the database"
            );
        });
    });
});
