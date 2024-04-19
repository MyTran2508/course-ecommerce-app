import { use } from "react";
import { Question } from "./section.type";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  otp: string;
  email: string;
  newPassword: string;
}

export interface SearchCourseRequest {
  levelIds?: string[];
  languageIds?: string[];
  topicIds?: string[];
  filterSortBy?: string;
  isFree?: boolean | null;
  ratingsLevel?: string | null;
  keyword: string | null;
  pageIndex: number;
  pageSize: number;
}

export interface SearchRequest {
  sortBy?: string;
  isDecrease?: boolean;
  keyword: any;
  pageIndex: number;
  pageSize: number;
}

export interface UserAnswerRequest {
  currentAnswer?: string;
  question?: Question;
}

export interface UserQuizRequest {
  userId?: string;
  startTime?: number;
  limitTime?: number;
  exQuizId?: string;
}
