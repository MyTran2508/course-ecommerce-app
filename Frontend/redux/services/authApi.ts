import { DataResponse } from "@/types/response.type";
import { ForgotPasswordRequest, LoginRequest } from "@/types/request.type";
import { User } from "@/types/user.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    loginUser: builder.mutation<DataResponse, LoginRequest>({
      query: (body: LoginRequest) => {
        return {
          url: "api/users/user/login",
          method: "POST",
          body: body,
        };
      },
    }),
    registerUser: builder.mutation<
      DataResponse,
      Omit<User, "id" | "photos" | "roles">
    >({
      query: (body: Omit<User, "id" | "photos">) => {
        return {
          url: "api/users/user/register/send-otp",
          method: "POST",
          body,
          params: {
            email: body.email,
          },
        };
      },
    }),
    verifyRegisterOTP: builder.mutation<
      DataResponse,
      { data: Omit<User, "id" | "photos" | "roles">; otp: string }
    >({
      query: ({ data, otp }) => {
        return {
          url: "api/users/user/register/verify-save",
          method: "POST",
          body: data,
          params: {
            email: data.email,
            otp: otp,
          },
        };
      },
    }),
    forgotPassword: builder.mutation<DataResponse, string>({
      query: (email) => {
        return {
          url: "api/users/user/forget-password/send-otp",
          method: "POST",
          params: {
            email,
          },
        };
      },
    }),

    verifyForgotPasswordOTP: builder.mutation<
      DataResponse,
      ForgotPasswordRequest
    >({
      query: (data) => {
        return {
          url: "api/users/user/forget-password/verify",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyRegisterOTPMutation,
  useVerifyForgotPasswordOTPMutation,
  useForgotPasswordMutation,
} = authApi;
