import { Course } from "./course.type"

export interface CourseProcess {
    userId: string
    currentProgress: number
    totalAmountOfLecture: number
    rateProgress: number
    course: Course
}