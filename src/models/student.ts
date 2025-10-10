import { Model, INTEGER, STRING } from "sequelize";
import type { Optional, Sequelize } from "sequelize";
import sequelize from "../utils/database.js";

interface StudentAttributes {
    id?: number;
    name: string;
    age: number;
    course: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type StudentInstance = Optional<StudentAttributes, "id">;

export const createStudentModel = (sequelizeInstance: Sequelize) => {
    return sequelizeInstance.define<Model<StudentAttributes, StudentInstance>>(
        "Student",
        {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: STRING,
                allowNull: false,
            },
            age: {
                type: INTEGER,
                allowNull: false,
            },
            course: {
                type: STRING,
                allowNull: false,
            },
        }
    );
}



const Student = createStudentModel(sequelize);

export default Student;
