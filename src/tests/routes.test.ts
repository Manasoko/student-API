import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import { MongoMemoryServer } from "mongodb-memory-server"

let studentId: string;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri as string);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

test("GET /api/v1/students", async () => {
  const res = await request(app).get("/api/v1/students");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("POST /api/v1/student", async () => {
  const newStudent = { firstName: "John", lastName: "Doe", studentClass: "100lvl", age: 20, subjects: ["Computer Science", "Mathematics"] };
  const res = await request(app).post("/api/v1/student").send(newStudent);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('student');
});

test("GET /api/v1/student/:id", async () => {
  const newStudent = { firstName: "Jane", lastName: "Doe", studentClass: "100lvl", age: 22, subjects: ["Mathematics"] };
  const postRes = await request(app).post("/api/v1/student").send(newStudent);

  const studentId = postRes.body.student._id;
  expect(studentId).toBeDefined();

  const getRes = await request(app).get(`/api/v1/student/${studentId}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body).toHaveProperty('_id', studentId);
});

test("PUT /api/v1/student/:id", async () => {
  const newStudent = { firstName: "Alice", lastName: "Smith", studentClass: "100lvl", age: 21, subjects: ["Physics"] };
  const postRes = await request(app).post("/api/v1/student").send(newStudent);
  const studentId = postRes.body.student._id;

  const updatedStudent = { firstName: "Alice", lastName: "Smith", studentClass: "100lvl", age: 21, subjects: ["Physics", "Mathematics"] };
  const putRes = await request(app).put(`/api/v1/student/${studentId}`).send(updatedStudent);
  expect(putRes.status).toBe(201);
  expect(putRes.body).toHaveProperty('message', "Updated successfully");
});

test("DELETE /api/v1/student/:id", async () => {
  const newStudent = { firstName: "Bob", lastName: "Jones", studentClass: "100lvl", age: 23, subjects: ["Physics", "Chemistry"] };
  const postRes = await request(app).post("/api/v1/student").send(newStudent);
  const studentId = postRes.body.student._id;

  const deleteRes = await request(app).delete(`/api/v1/student/${studentId}`);
  expect(deleteRes.status).toBe(200);

  const getRes = await request(app).get(`/api/v1/student/${studentId}`);
  expect(getRes.status).toBe(404);
});
