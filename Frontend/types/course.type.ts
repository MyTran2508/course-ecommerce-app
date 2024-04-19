import { is } from "immutable";

export interface Course {
  id?: string;
  name: string;
  subTitle?: string;
  price?: number;
  level: Level;
  language: Language;
  urlCourseImages?: string;
  urlPromotionVideos?: string;
  authorName?: string;
  topic: Topic;
  isApproved?: boolean;
  isCompletedContent?: boolean;
  isAwaitingApproval?: boolean;
  courseIssueReports?: CourseIssueReport | {};
  averageRating?: number;
  totalRatings?: number;
  isAlreadyReviewed?: boolean;
  ratingNumbersByStar?: Record<string, number>;
}
export interface CourseIssueReport {
  id?: string;
  issueType: string;
  message: string;
  severityLevel: string;
}

export interface Level {
  id: string;
  name?: string;
  description?: string;
}

export interface Topic {
  id: string;
  name?: string;
  description?: string;
}

export interface Language {
  id: string;
  name?: string;
}
