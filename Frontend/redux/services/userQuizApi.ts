import { use } from "react";
import { DataResponse, PageResponse } from "@/types/response.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";
import { UserAnswer, UserQuiz } from "@/types/section.type";
import { UserAnswerRequest, UserQuizRequest } from "@/types/request.type";

export const userQuizApi = createApi({
  reducerPath: "userQuiz",
  baseQuery: baseQueryWithToken,
  tagTypes: ["UserQuiz"],
  endpoints: (builder) => ({
    getUserQuizByUserIdAndQuizId: builder.query<
      DataResponse,
      { userId: string; exQuizId: string }
    >({
      query: ({ userId, exQuizId }) => {
        return {
          url: `/api/courses/user-quiz/get`,
          params: { userId, exQuizId },
        };
      },
      providesTags: (result, error, arg) =>
        result && result.statusCode === 200
          ? [
              ...((result.data as UserQuiz).userAnswers as UserAnswer[])?.map(
                (userAnswer) => ({
                  type: "UserQuiz" as const,
                  id: userAnswer.id,
                })
              ),
              { type: "UserQuiz" as const, id: "UserAnswer" },
            ]
          : [{ type: "UserQuiz" as const, id: arg.exQuizId }],
    }),
    addUserQuiz: builder.mutation<DataResponse, UserQuizRequest>({
      query: (data: UserQuizRequest) => {
        return {
          url: `/api/courses/user-quiz/add`,
          method: "POST",
          body: data,
        };
      },
    }),
    upsertUserQuiz: builder.mutation<
      DataResponse,
      { userQuizId: string; isSubmit: boolean; data: UserAnswerRequest[] }
    >({
      query: ({ userQuizId, isSubmit, data }) => {
        console.log(data);
        return {
          url: `/api/courses/user-answer/upsert`,
          params: {
            "user-quiz-id": userQuizId,
            "is-submit": isSubmit,
          },
          body: data,
          method: "POST",
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "UserQuiz", id: "UserAnswer" },
      ],
    }),
  }),
});

export const {
  useGetUserQuizByUserIdAndQuizIdQuery,
  useLazyGetUserQuizByUserIdAndQuizIdQuery,
  useAddUserQuizMutation,
  useUpsertUserQuizMutation,
} = userQuizApi;
