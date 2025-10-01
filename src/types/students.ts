export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    studentClass: string;
    year_joined?: Date;
    subjects: Array<string>;
}