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
import { SearchRequest } from "@/types/request.type";
import { ForumLecture } from "@/types/forumLecture";

export const forumApi = createApi({
  reducerPath: "FORUM_API",
  baseQuery: baseQueryWithToken,
  tagTypes: ["FORUM_API"],
  endpoints: (builder) => ({
    getForumLectureById: builder.mutation<ListResponse, SearchRequest>({
      query: (lectureId: SearchRequest) => {
        return {
          url: `/api/courses/forum-lecture/search-by-keyword`,
          body: lectureId,
          method: "POST",
        };
      },
    }),
    addForumLecture: builder.mutation<DataResponse, ForumLecture>({
      query: (data: ForumLecture) => {
        return {
          url: `/api/courses/forum-lecture/add`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateForumLecture: builder.mutation<DataResponse, ForumLecture>({
      query: (data: ForumLecture) => {
        return {
          url: `/api/courses/forum-lecture/update/${data.id}`,
          body: data,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useAddForumLectureMutation,
  useGetForumLectureByIdMutation,
  useUpdateForumLectureMutation,
} = forumApi;
