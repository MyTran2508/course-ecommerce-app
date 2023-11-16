import Content from "./content.type";
import { Course } from "./course.type";
import { User } from "./user.type";

export interface DataResponse {
    timestamp: number,
    statusCode: number,
    statusMessage: string,
    data: string | string[] | User | Course | Content
}