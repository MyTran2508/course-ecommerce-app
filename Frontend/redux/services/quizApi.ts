import { DataResponse, PageResponse } from "@/types/response.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";
import { ExQuiz, Question } from "@/types/section.type";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["Quiz"],
  endpoints: (builder) => ({
    getExQuizById: builder.query<
      DataResponse,
      { id: string; page: PageResponse }
    >({
      query: ({ id, page }) => {
        return {
          url: `/api/courses/question/manager/get-by-ex-quiz-id/${id}/${page.pageIndex}/${page.pageSize}`,
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              { type: "Quiz" as const, id: arg.id },
              ...(result.data as Question[])?.map((item) => ({
                type: "Quiz" as const,
                id: item.id,
              })),
              { type: "Quiz" as const, id: "Quiz" },
            ]
          : [{ type: "Quiz" as const, id: "Quiz" }],
    }),
    addQuestion: builder.mutation<DataResponse, { id: string; data: Question }>(
      {
        query: ({ id, data }) => {
          return {
            url: `/api/courses/question/add/${id}`,
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: () => [{ type: "Quiz" as const, id: "Quiz" }],
      }
    ),
    updateQuestion: builder.mutation<DataResponse, Question>({
      query: (data: Question) => {
        return {
          url: `/api/courses/question/update/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Quiz" as const, id: arg.id },
      ],
    }),
    updateListQuestion: builder.mutation<
      DataResponse,
      { id: string; data: Question[] }
    >({
      query: ({ id, data }) => {
        return {
          url: `/api/courses/question/update-list/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: () => [{ type: "Quiz" as const, id: "Quiz" }],
    }),
  }),
});

export const {
  useGetExQuizByIdQuery,
  useLazyGetExQuizByIdQuery,
  useAddQuestionMutation,
  useUpdateListQuestionMutation,
  useUpdateQuestionMutation,
} = quizApi;
