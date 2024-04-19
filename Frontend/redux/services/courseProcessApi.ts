import { DataResponse } from "@/types/response.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";

export const courseProcessApi = createApi({
  reducerPath: "courseProcessApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["CourseProcess"],
  endpoints: (builder) => ({
    getByUserIdAndCourseId: builder.query<
      DataResponse,
      { courseId: string; userId: string }
    >({
      query: ({ courseId, userId }) => {
        return {
          url: `/api/courses/course-progress/get-by-userId-courseId`,
          params: {
            userId: userId,
            courseId: courseId,
          },
        };
      },
      providesTags() {
        return [{ type: "CourseProcess", id: "course" }];
      },
    }),
    updateCurrentProgress: builder.mutation<
      DataResponse,
      { courseId: string; userId: string }
    >({
      query: ({ courseId, userId }) => {
        return {
          url: `/api/courses/course-progress/update-current-progress`,
          method: "POST",
          params: {
            userId: userId,
            courseId: courseId,
          },
        };
      },
      invalidatesTags: () => [{ type: "CourseProcess", id: "course" }],
    }),
    getCourseAccess: builder.query<
      DataResponse,
      { courseId: string; userId: string }
    >({
      query: ({ courseId, userId }) => {
        return {
          url: `/api/courses/course-progress/has-access-to-course`,
          params: {
            userId: userId,
            courseId: courseId,
          },
        };
      },
    }),
  }),
});

export const {
  useGetCourseAccessQuery,
  useLazyGetCourseAccessQuery,
  useUpdateCurrentProgressMutation,
  useGetByUserIdAndCourseIdQuery,
} = courseProcessApi;
