import { RootState } from './store';
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { store } from "./store"
const baseUrl =  process.env.NEXT_PUBLIC_END_POINT

export const baseQueryWithToken = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
        const token = store.getState().persistedReducer.authReducer.token;

        if (token) {
			headers.set('authorization', `Bearer ${token}`);
        }
        // headers.set("Access-Control-Allow-Origin", "http://localhost:3000/"),
        // headers.set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS"),
        // headers.set("Access-Control-Allow-Headers", "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"),
        // headers.set("Access-Control-Allow-Credentials", "true")

		return headers;
    }
})

export const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
     prepareHeaders: (headers) => {
        // headers.set("Access-Control-Allow-Origin", "http://localhost:3000/"),
        // headers.set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS"),
        // headers.set("Access-Control-Allow-Headers", "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"),
        // headers.set("Access-Control-Allow-Credentials", "true")

		return headers;
    }
});