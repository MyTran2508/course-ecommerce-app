// import { SECTION } from './resources';
// import { Content } from '@/types/content.type';
// import { User } from './../types/user.type';

export enum Constant {
  SECTION = "Chương",
  LECTURE = "Bài học",
  QUESTION = "Câu hỏi",
}

export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_PAGE_INDEX = 0;

export enum Action {
  SENT_OTP = "SENT_OTP",
  REGISTER = "REGISTER",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

export enum StatusCode {
  REQUEST_SUCCESS = 200,
  DATA_NOT_FOUND = 404,
  DATA_NOT_MAP = 406,
  NOT_IMPLEMENTED = 501,
  DATA_CONFLICT = 409,
  NOT_PERMISSION = 403,
}

export enum ToastStatus {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export enum ToastMessage {
  //Login
  LOGIN_SUCCESS = "Đăng Nhập Thành Công",
  LOGIN_FAIL = "Đăng Nhập Thất Bại",
  LOGIN_REQUIRED = "Vui Lòng Đăng Nhập",
  LOGOUT_SUCCESS = "Đăng Xuất Thành Công",

  //Payment
  NOT_SELECT_PAYMENT = "Vui Lòng Chọn Phương Thức Thanh Toán",
  PAYMENT_SUCCESS = "Thanh Toán Thành Công",
  PAYMENT_FAIL = "Thanh Toán Thất Bại",
  CHECK_PRICE = "Vui lòng chọn khóa học để thanh toán",

  //Cart
  ADD_CART_SUCCESS = "Thêm Sản Phẩm Thành Công",
  ADD_CART_DUPLICATE = "Sản Phẩm Đã Có Trong Giỏ Hàng",
  DELETE_CART_SUCCESS = "Xóa Sản Phẩm Thành Công",

  //User
  CHANGE_PASSWORD_SUCCESS = "Đổi Mật Khẩu Thành Công",
  CHANGE_PASSWORD_FAIL = "Mật Khẩu Không Chính Xác",
  UPDATE_USER_SUCCESS = "Cập Nhật Thông Tin Thành Công",
  UPDATE_USER_FAIL = "Cập Nhật Thông Tin Thất Bại",

  //Course
  CREATE_COURSE_SUCCESS = "Thêm Thông Tin Khóa Học Thành Công",
  CREATE_COURSE_FAIL = "Thêm Thông Tin Khóa Học Thất Bại",
  DATA_COURSE_EXISTED = "Tên Khóa Học Đã Tồn Tại",
  UPDATE_COURSE_SUCCESS = "Cập Nhật Thông Tin Khóa Học Thành Công",
  UPDATE_COURSE_FAIL = "Cập Nhật Thông Tin Khóa Học Thất Bại",
  REGISTER_COURSE_SUCCESS = "Khóa Học Đã Được Thêm",

  //Content
  UPDATE_CONTENT_SUCCESS = "Cập Nhật Thông Tin Chi Tiết Thành Công",
  UPDATE_CONTENT_FAIL = "Cập Nhật Thông Tin Chi Tiết Thất Bại",
  CHECK_CREATE_CONTENT = "Vui Lòng Hoàn Thành Chi Tiết Khóa Học",

  //Question
  ENTER_QUESTION = "Vui lòng nhập câu hỏi",
  ENTER_RIGHT_ANSWER = "Vui lòng chọn câu trả lời đúng",
  ENTER_ANSWER = "Vui lòng nhập đầy đủ câu trả lời",
  ENTER_EXPLANATION = "Vui lòng nhập giải thích cho câu trả lời đúng",

  //Quiz
  SUBMIT_SUCCESS = "Thời gian làm bài đã hết",

  //Review
  REVIEW_SUCCESS = "Đánh giá thành công",
  UPDATE_REVIEW_SUCCESS = "Cập nhật đánh giá thành công",
  PLEASE_WAIT = "Vui lòng chờ trong giây lát",
}

export enum Role {
  USER = "ROLE_USER",
  ADMIN = "ROLE_ADMIN",
  MANAGER = "ROLE_MANAGER",
  GUEST = "ROLE_GUEST",
}

export enum ApiResource {}

export enum CourseDescriptionField {
  REQUIREMENT = "REQUIREMENT",
  DETAIL = "DETAIL",
  TARGET_CONSUMER = "TARGET_CONSUMER",
}

export enum LectureType {
  // SESSION = "SESSION",
  // LECTURE = "LECTURE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  EXERCISE_CODING = "EXERCISE_CODING",
  EXERCISE_PRACTICAL = "EXERCISE_PRACTICAL",
  QUIZ_TEST = "QUIZ_TEST",
}

export enum CourseLectureField {
  URL = "url",
  NAME = "name",
  FILENAME = "fileName",
}

export enum IssueType {
  CONTENT_FORMAT = "CONTENT FORMAT ERROR",
  FILE_ERROR = "IMAGE OR VIDEO FILE ERROR",
  OTHER = "OTHER TYPES OF ERRORS",
}
export enum SecurityLevel {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum FilterSortBy {
  NEWEST = "NEWEST",
  POPULAR = "POPULAR",
  NONE = "NONE",
}

export enum QuizType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
}
