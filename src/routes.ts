import express from "express";
import type { Request, Response } from "express";
import { Sequelize } from "sequelize";
import sequelize from "./utils/database.js";
import { createStudentModel } from "./models/student.js";


export const createRouter = (sequelizeInstance: Sequelize = sequelize) => {
    const router = express.Router();
    const Student = createStudentModel(sequelizeInstance);

    router.get("/", (req, res) => {
        res.send("Hello, World!");
    });

    router.get("/students", async (req: Request, res: Response) => {
        const students = await Student.findAll({
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        });
        console.info("Gotten all students");
        res.status(200).json(students);
    });

    router.post("/student", async (req: Request, res: Response) => {
        const { name, age, course } = req.body;

        if (!name || !age || !course) {
            return res.status(400).json({ 
                message: "Missing required fields: name, age, course" 
            });
        }

        const student = await Student.create({
            name,
            age,
            course,
        });

        console.info("Student added successfully");
        res.status(201).json({ 
            message: "Created Successfully", 
            student 
        });
    });

    router.get("/student/:id", async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return res.status(403).json({ message: "Please provide an Id" });
        }
        const student = await Student.findByPk(id, {
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        });

        if (!student) {
            console.error("No student in Database");
            return res
                .status(404)
                .json({ message: "Student not found in the database" });
        }

        console.info("Gotten the student");
        res.status(200).json(student);
    });

    router.patch("/student/:id", async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return res.status(403).json({ message: "Please provide an Id" });
        }
        try {
            const [affectedCount] = await Student.update(
                {
                    name: req.body?.name,
                    age: req.body?.age,
                    course: req.body?.course,
                },
                {
                    where: { id },
                }
            );

            if (affectedCount === 0) {
                return res.status(404).json({ 
                    message: "Student not found" 
                });
            }

            res.status(200).json({ message: "Updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    router.delete("/student/:id", async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return res.status(403).json({ message: "Please provide an Id" });
        }
        
        const deletedCount = await Student.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            return res.status(404).json({ 
                message: "Student not found" 
            });
        }

        await sequelizeInstance.query("ALTER TABLE Students AUTO_INCREMENT = 1");
        res.status(200).json({ message: "Deleted successfully" });
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

    return router;
};

// Default export for production use
const router = createRouter();
export default router;