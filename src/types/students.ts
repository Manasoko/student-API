export interface Student {
    id: string;
    name: string;
    age: number;
    studentClass: string;
    year_joined?: Date;
    subjects: Array<string>;
}