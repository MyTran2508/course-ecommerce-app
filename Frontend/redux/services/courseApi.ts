import { DataResponse, ListResponse } from "@/types/response.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";
import { Course, CourseIssueReport } from "@/types/course.type";
import { SearchCourseRequest, SearchRequest } from "@/types/request.type";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    uploadCourseImage: builder.mutation<DataResponse, File>({
      query: (image: File) => {
        var bodyFormData = new FormData();
        bodyFormData.append("file", image);
        return {
          url: "/api/courses/course/images",
          method: "POST",
          body: bodyFormData,
          formData: true,
          responseHandler: "content-type",
        };
      },
    }),
    uploadCourseVideo: builder.mutation<DataResponse, File>({
      query: (video: File) => {
        var bodyFormData = new FormData();
        bodyFormData.append("file", video);
        return {
          url: "/api/courses/course/videos",
          method: "POST",
          body: bodyFormData,
          formData: true,
        };
      },
    }),
    loadFileFromCloud: builder.query<string, string>({
      query: (path: string) => {
        return {
          url: "/api/courses/course/download",
          params: {
            path: path,
          },
          responseHandler: "text",
        };
      },
    }),
    createCourse: builder.mutation<DataResponse, Course>({
      query: (data: Course) => {
        return {
          url: "/api/courses/course/add",
          method: "POST",
          body: data,
        };
      },
    }),
    updateCourseById: builder.mutation<DataResponse, Course>({
      query: (data: Course) => {
        return {
          url: `/api/courses/course/update/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: () => [{ type: "Course", id: "course" }],
    }),
    getCourseById: builder.query<DataResponse, string>({
      query: (id: string) => {
        return {
          url: `/api/courses/course/get-by-id`,
          params: {
            id: id,
          },
        };
      },
      providesTags() {
        return [{ type: "Course", id: "course" }];
      },
    }),
    getNewestCourse: builder.query<
      DataResponse,
      { topicId: number; size: number }
    >({
      query: ({ topicId, size }) => {
        return {
          url: `/api/courses/course/newest/${topicId}/${size}`,
        };
      },
      providesTags() {
        return [{ type: "Course", id: "course" }];
      },
    }),
    getPopularCourse: builder.query<
      DataResponse,
      { topicId: number; size: number }
    >({
      query: ({ topicId, size }) => {
        return {
          url: `/api/courses/course/popular/${topicId}/${size}`,
        };
      },
      providesTags() {
        return [{ type: "Course", id: "course" }];
      },
    }),
    getCourseByUserId: builder.query<
      ListResponse,
      { id: string; pageIndex: number; pageSize: number }
    >({
      query: ({ id, pageIndex, pageSize }) => {
        return {
          url: `/api/courses/course/get-all-by-user-id`,
          params: {
            userId: id,
            pageIndex: pageIndex,
            pageSize: pageSize,
          },
        };
      },
    }),
    getAllCourse: builder.query<ListResponse, null>({
      query: () => {
        return {
          url: `/api/courses/course/get-all`,
        };
      },
    }),
    filterCourse: builder.mutation<ListResponse, SearchCourseRequest>({
      query: (data: SearchCourseRequest) => {
        return {
          url: `/api/courses/course/filter`,
          method: "POST",
          body: data,
        };
      },
    }),
    filterCourseAdmin: builder.mutation<ListResponse, SearchRequest>({
      query: (data: SearchRequest) => {
        return {
          url: `/api/courses/course/search-by-keyword`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateApproved: builder.mutation<
      DataResponse,
      {
        courseId: string;
        isApproved: boolean;
        courseIssueReport: CourseIssueReport | {};
      }
    >({
      query: ({ courseId, isApproved, courseIssueReport }) => {
        return {
          url: `/api/courses/course/update-approved`,
          method: "POST",
          params: {
            id: courseId,
            isApproved: isApproved,
          },
          body: courseIssueReport,
        };
      },
      invalidatesTags: () => [{ type: "Course", id: "course" }],
    }),
    updateAwaitingApproval: builder.mutation<
      DataResponse,
      { courseId: string; isAwaitingApproval: boolean }
    >({
      query: ({ courseId, isAwaitingApproval }) => {
        return {
          url: `/api/courses/course/update-awaiting-approval`,
          method: "POST",
          params: {
            id: courseId,
            isAwaitingApproval: isAwaitingApproval,
          },
        };
      },
      invalidatesTags: () => [{ type: "Course", id: "course" }],
    }),
    saleByTopics: builder.query<DataResponse, number>({
      query: (targetYear: number) => {
        return {
          url: `/api/courses/course/sales-by-topics`,
          params: {
            targetYear: targetYear,
          },
        };
      },
    }),
    salesSamePeriodByTopics: builder.query<DataResponse, number>({
      query: (targetYear: number) => {
        return {
          url: `/api/courses/course/sales-same-period-by-topics`,
          params: {
            targetYear: targetYear,
          },
        };
      },
    }),
    getTotalApprovedCourse: builder.mutation<
      DataResponse,
      { targetMonth: number; targetYear: number }
    >({
      query: (data: { targetMonth: number; targetYear: number }) => {
        return {
          url: `/api/courses/course/get-total-approved-course`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoadFileFromCloudQuery,
  useLazyLoadFileFromCloudQuery,
  useLazyGetAllCourseQuery,
  useFilterCourseAdminMutation,
  useUploadCourseImageMutation,
  useUploadCourseVideoMutation,
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseByIdMutation,
  useGetNewestCourseQuery,
  useGetCourseByUserIdQuery,
  useGetAllCourseQuery,
  useFilterCourseMutation,
  useUpdateApprovedMutation,
  useUpdateAwaitingApprovalMutation,
  useGetPopularCourseQuery,
  useSaleByTopicsQuery,
  useSalesSamePeriodByTopicsQuery,
  useGetTotalApprovedCourseMutation,
  useLazySalesSamePeriodByTopicsQuery,
  useLazySaleByTopicsQuery,
} = courseApi;
