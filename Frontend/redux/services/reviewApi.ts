import { course } from "./../features/courseSlice";
import { use } from "react";
import {
  DataResponse,
  ListResponse,
  PageResponse,
} from "@/types/response.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";
import { Review } from "@/types/review.type";
import { argv } from "process";
import { SearchCourseRequest } from "@/types/request.type";

export const reviewApi = createApi({
  reducerPath: "Review",
  baseQuery: baseQueryWithToken,
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviewByUserNameAndCourseId: builder.query<
      DataResponse,
      { username: string; courseId: string }
    >({
      query: ({ username, courseId }) => {
        return {
          url: `/api/courses/course-review/get-by-username-courseId`,
          params: { username, courseId },
        };
      },
      providesTags: (result, error, arg) => {
        if (result && result.statusCode === 200) {
          return [{ type: "Review" as const, id: (result.data as Review).id }];
        }
        return [];
      },
    }),
    getReviewByCourseId: builder.mutation<ListResponse, SearchCourseRequest>({
      query: (courseId: SearchCourseRequest) => {
        return {
          url: `/api/courses/course-review/search-by-keyword`,
          body: courseId,
          method: "POST",
        };
      },
    }),
    addReview: builder.mutation<DataResponse, Review>({
      query: (data: Review) => {
        return {
          url: `/api/courses/course-review/add`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateReview: builder.mutation<DataResponse, Review>({
      query: (data: Review) => {
        return {
          url: `/api/courses/course-review/update/${data.id}`,
          body: data,
          method: "PUT",
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Review" as const, id: arg.id },
      ],
    }),
    setLikeReview: builder.mutation<
      DataResponse,
      { courseReviewId: string; username: string; isCancel: boolean }
    >({
      query: ({ courseReviewId, username, isCancel }) => {
        return {
          url: `/api/courses/course-review/set-like`,
          method: "POST",
          params: { courseReviewId, username, isCancel },
        };
      },
    }),
    setDisLikeReview: builder.mutation<
      DataResponse,
      { courseReviewId: string; username: string; isCancel: boolean }
    >({
      query: ({ courseReviewId, username, isCancel }) => {
        return {
          url: `/api/courses/course-review/set-dislike`,
          method: "POST",
          params: { courseReviewId, username, isCancel },
        };
      },
    }),
  }),
});

export const {
  useGetReviewByUserNameAndCourseIdQuery,
  useLazyGetReviewByUserNameAndCourseIdQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useGetReviewByCourseIdMutation,
  useSetLikeReviewMutation,
  useSetDisLikeReviewMutation,
} = reviewApi;
