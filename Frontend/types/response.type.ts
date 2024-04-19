import { Page } from "react-pdf";
import {
  MonthlySale,
  SalesByTopic,
  SalesSamePeriod,
  SalesSamePeriodByTopics,
  Statistics,
} from "@/app/admin/overview/page";
import Content from "./content.type";
import { Course } from "./course.type";
import { CourseProcess } from "./courseProcess.type";
import { User } from "./user.type";
import { Question, UserQuiz } from "./section.type";
import { Review } from "./review.type";
import { ForumLecture } from "./forumLecture";

export interface DataResponse {
  timestamp: number;
  statusCode: number;
  statusMessage: string;
  data:
    | string
    | number
    | string[]
    | User
    | Course
    | Content
    | Course[]
    | boolean
    | CourseProcess
    | SalesByTopic[]
    | MonthlySale[]
    | SalesSamePeriod[]
    | SalesSamePeriodByTopics[]
    | Statistics
    | Question[]
    | UserQuiz
    | Review;
}

export interface ListResponse {
  timestamp: number;
  statusCode: number;
  statusMessage: string;
  totalRecords: number;
  totalPages: number;
  data: Course[] | User[] | Review[] | ForumLecture[];
}

export interface PageResponse {
  pageIndex: number;
  pageSize: number;
}

export interface AvatarResponse {
  rawAvatar: string;
}
