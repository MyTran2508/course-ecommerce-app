"use client";
import {
  AnyAction,
  isRejectedWithValue,
  Middleware,
  isRejected,
  MiddlewareAPI,
  Dispatch,
} from "@reduxjs/toolkit";

import { logout } from "@/redux/features/authSlice";
import { removeUser } from "@/redux/features/userSlice";
import { Role } from '../utils/resources';
import * as _ from "lodash"

function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string;
  };
  status: number;
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    typeof (payload as any).data?.error === "string"
  );
}

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    const dispatch = api.dispatch
    if (isRejectedWithValue(action)) {
      if (isPayloadErrorMessage(action.payload)) {
        const error = action.payload.data.error
        // showToast(ToastStatus.WARNING, error);
        console.log(error)
        if (error === "Internal Server Error") {
          dispatch(logout());
          dispatch(removeUser());
        }
      }
    }
    return next(action);
  };

export const AuthMiddleware: Middleware =
  (api: MiddlewareAPI) => {

    return (next) => (action: AnyAction) => {
    // const roles = api.getState().persistedReducer.userReducer.user.roles
    // const loginUrl = '/login';
    // const homeUrl = '/'
      
    // if (typeof window !== 'undefined') { 
    //   const pathname = window.location.pathname;
    //   if (roles) {
    //     const role = roles[0].id
    //     if ((isAdminRoute(pathname) || isManagerRoute(pathname)) && _.isEqual(role, Role.USER)) {
    //       window.location.href = homeUrl
    //     }

    //     if ((isUserRoute(pathname) || isManagerRoute(pathname) || isAdminRoute(pathname)) && _.isEqual(role, Role.GUEST)) {
    //       window.location.href = loginUrl
    //     }
    //     return next(action);
    //   } else {
    //     if (isManagerRoute(pathname) || isAdminRoute(pathname)) {
    //       window.location.href = homeUrl
    //     } else {
    //       return next(action);
    //     }  
    //   }
    // }
    return next(action);
  }
} 

const userRoutes = ['/my-courses', '/payment/checkout', '/learning', '/user'];

const isAdminRoute = (pathname: string) => {
    return pathname.startsWith('/admin');
}

const isManagerRoute = (pathname: string) => {
    return pathname.startsWith('/instructor');
}

const isUserRoute = (pathname: string) => {
  return userRoutes.some((route) => pathname.startsWith(route));
};