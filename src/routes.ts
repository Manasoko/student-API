import express from "express";
import type {Request, Response} from "express";
import type { Student } from "./types/students.js";

const router = express.Router();

router.get('/students', (req: Request, res:Response) => {
});
router.post('/student', (req: Request, res:Response) => {

});
router.get('/student/:id', (req: Request, res:Response) => {

});
router.put('/student/:id', (req: Request, res:Response) => {

});
router.delete('/student/:id', (req: Request, res:Response) => {

});

export default router;