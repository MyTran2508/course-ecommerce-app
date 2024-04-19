import { Course } from "./course.type";
import { Section } from "./section.type";

export default interface Content {
    id?: string,
    description: Description,
    course: Pick<Course, "id"> | Course
    sections?: Section[]
}

export interface Description {
    id?: string,
    requirements: string,
    details: string,
    targetConsumers: string
}