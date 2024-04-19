import { is } from "immutable";
import { Course } from "./course.type";

export interface Review {
  id?: string;
  course?: Course;
  message?: string;
  rating?: number;
  username?: string;
  userAvatar?: string;
  likeAmount?: number;
  disLikeAmount?: number;
  isUserLiking?: boolean;
  isUserDisliking?: boolean;
}
