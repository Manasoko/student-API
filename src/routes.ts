import express from "express";
import type { Request, Response } from "express";
import type { Student } from "./types/students.js";
import studentModel from "./models/student.js";

const router = express.Router();

router.get("/students", async (req: Request, res: Response) => {
  const students = await studentModel.find();
  return res.status(200).json(students);
});

router.post("/student", async (req: Request, res: Response) => {
  const { firstName,lastName, studentClass, age, subjects }: Student = req.body;

  if (!firstName || !lastName || !studentClass || !age || !subjects)
    return res.status(400).json({ message: "All fields are required" });

  const student = await studentModel.create({
    firstName: firstName,
    lastName: lastName,
    studentClass: studentClass,
    age: age,
    subjects: [...subjects],
  });

  return res.status(201).json({ message: "Created successfully", student:student });
});

router.get("/student/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const student = await studentModel.findById(id);
  if (!student)
    return res.status(404).json({ message: "Student is not in the database" });
  return res.status(200).json(student);
});

router.put("/student/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const student = await studentModel.findById(id);
    if (!student)
      return res
        .status(404)
        .json({ message: "Student is not in the database" });

    student.firstName = req.body.firstName || student.firstName;
    student.lastName = req.body.lastName || student.lastName;
    student.studentClass = req.body.studentClass || student.studentClass;
    student.age = req.body.age || student.age;
    const subjects = [...req.body.subjects, ...student.subjects];
    const filteredSubjects = subjects.filter(
      (item, index) => subjects.indexOf(item) === index
    );
    student.subjects = [...filteredSubjects];

    await student.save();
    return res.status(201).json({ message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something happened", error: error });
  }
});

router.delete("/student/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await studentModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something happened", error: error });
  }
});

router.get('/healthcheck', (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error as string;
    res.status(503).send();
  }
});

export default router;
