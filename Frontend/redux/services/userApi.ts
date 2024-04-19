import { baseQuery } from "./../baseQuery";
import {
  ChangePasswordRequest,
  SearchRequest,
} from "./../../types/request.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "../baseQuery";
import {
  AvatarResponse,
  DataResponse,
  ListResponse,
} from "@/types/response.type";
import { User } from "@/types/user.type";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getByUserName: builder.query<DataResponse, string>({
      query: (username) => `api/users/user/get-by-username/${username}`,
      providesTags(result) {
        return [{ type: "User", id: (result?.data as User)?.id }];
      },
    }),

    getAllUser: builder.query<ListResponse, null>({
      query: () => `api/users/user/get-all`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...(result.data as User[]).map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              "User",
            ]
          : ["User"],
    }),

    filterUser: builder.mutation<ListResponse, SearchRequest>({
      query: (data: SearchRequest) => {
        return {
          url: `api/users/user/search-by-keyword`,
          method: "POST",
          body: data,
        };
      },
      // providesTags: ()=>[{ type: 'User', id: "id" }]
      // providesTags: (result, error, arg) =>
      //   result
      //     ? [...(result.data as User[]).map(({ id }) => ({ type: 'User' as const, id })), 'User']
      //     : ['User'],
    }),

    updateUser: builder.mutation<
      DataResponse,
      Omit<User, "re_password" | "password" | "roles" | "photos">
    >({
      query: (data: Omit<User, "re_password" | "password" | "roles">) => {
        return {
          url: `api/users/user/update/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (result, error, data) => [{ type: "User", id: data.id }],
    }),
    updateUserAdmin: builder.mutation<
      DataResponse,
      Omit<User, "re_password" | "password" | "photos">
    >({
      query: (data: Omit<User, "re_password" | "password" | "photos">) => {
        return {
          url: `api/users/user/update-admin/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (result, error, data) => [{ type: "User", id: data.id }],
    }),
    changePassword: builder.mutation<DataResponse, ChangePasswordRequest>({
      query: (data) => {
        return {
          url: `api/users/user/change-password/${data.userId}`,
          method: "PUT",
          body: data,
        };
      },
    }),

    getAvatar: builder.query<AvatarResponse, string>({
      query: (username) => ({
        url: `api/users/user/photos/${username}`,
        // responseHandler: "text",
      }),
      providesTags: () => [{ type: "User", id: "avatar" }],
    }),

    uploadImage: builder.mutation<
      DataResponse,
      { username: string; image: File }
    >({
      query: ({ username, image }) => {
        var bodyFormData = new FormData();
        bodyFormData.append("image", image);
        console.log(bodyFormData, image);
        return {
          url: `api/users/user/photos/${username}`,
          method: "POST",
          body: bodyFormData,
          formData: true,
        };
      },
      invalidatesTags: () => [{ type: "User", id: "avatar" }],
    }),
    getStatistics: builder.mutation<
      DataResponse,
      { targetMonth: number; targetYear: number }
    >({
      query: (data: { targetMonth: number; targetYear: number }) => {
        return {
          url: `/api/users/user/get-statistics`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetByUserNameQuery,
  useChangePasswordMutation,
  useGetAvatarQuery,
  useLazyGetAvatarQuery,
  useLazyGetByUserNameQuery,
  useUploadImageMutation,
  useUpdateUserAdminMutation,
  useGetAllUserQuery,
  useFilterUserMutation,
  useGetStatisticsMutation,
} = userApi;
