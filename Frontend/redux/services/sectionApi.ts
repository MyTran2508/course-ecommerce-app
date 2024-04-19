import { DataResponse } from "@/types/response.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";
import { Course } from "@/types/course.type";
import { Section } from "@/types/section.type";

export const sectionApi = createApi({
  reducerPath: "sectionApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["Section", "Content"],
  endpoints: (builder) => ({
    uploadSectionFiles: builder.mutation<DataResponse, File[]>({
      query: (files: File[]) => {
        var bodyFormData = new FormData();
        files.forEach((file) => bodyFormData.append("files", file));
        return {
          url: "/api/courses/section/upload",
          method: "POST",
          body: bodyFormData,
          formData: true,
        };
      },
    }),
    loadFileDocumentFromCloud: builder.query<string, string>({
      query: (path: string) => {
        return {
          url: "/api/courses/section/download",
          params: {
            path: path,
          },
          responseHandler: "text",
        };
      },
    }),
    getSectionById: builder.query<DataResponse, string>({
      query: (id: string) => {
        return {
          url: `/api/courses/course/get-by-id`,
          params: {
            id: id,
          },
        };
      },
    }),
    // addSection: builder.mutation<DataResponse, Section>({
    //   query: (data: Section) => {
    //     return {
    //       url: "/api/courses/section/add",
    //       method: "POST",
    //       body: data
    //     }
    //   },
    //   invalidatesTags:()=> [{ type: 'Content' as const, id: 'Section' }]
    // }),
  }),
});

export const {
  useUploadSectionFilesMutation,
  useLazyLoadFileDocumentFromCloudQuery,
  // useAddSectionMutation,
} = sectionApi;
