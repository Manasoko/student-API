import mongoose from 'mongoose';
import type { Student } from '../types/students.js';

const { Schema, model } = mongoose;

const studentSchema = new Schema<Student>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  studentClass: { type: String, required: true },
  subjects: [{ type: String, trim: true, required: true }],
});

const studentModel = model<Student>('Student', studentSchema);

export default studentModel;