import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import authReducer, { AuthState } from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import userReducer, { UserState } from "./features/userSlice";
import courseReducer from "./features/courseSlice";
import contentReducer from "./features/contentSlice";
import sectionReducer from "./features/sectionSlice";
import quizReducer, { QuizState } from "./features/quizSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { AuthMiddleware, rtkQueryErrorLogger } from "@/config/middleware";
import { userApi } from "./services/userApi";
import { courseApi } from "./services/courseApi";
import { contentApi } from "./services/contentApi";
import { sectionApi } from "./services/sectionApi";
import { orderApi } from "./services/orderApi";
import { quizApi } from "./services/quizApi";
import { reviewApi } from "./services/reviewApi";
import { forumApi } from "./services/forumApi";
import { userQuizApi } from "./services/userQuizApi";
import { courseProcessApi } from "./services/courseProcessApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Cart } from "@/types/cart.type";

const persistConfig = {
  key: "root",
  storage,
};
export interface RootStateReduxPersist {
  cartReducer: Cart[];
  authReducer: AuthState;
  userReducer: UserState;
  quizReducer: QuizState;
}

const rootReducer = combineReducers<RootStateReduxPersist>({
  cartReducer,
  authReducer,
  userReducer,
  quizReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
    courseReducer,
    contentReducer,
    sectionReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [sectionApi.reducerPath]: sectionApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [forumApi.reducerPath]: forumApi.reducer,
    [userQuizApi.reducerPath]: userQuizApi.reducer,
    [courseProcessApi.reducerPath]: courseProcessApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      courseApi.middleware,
      contentApi.middleware,
      sectionApi.middleware,
      orderApi.middleware,
      courseProcessApi.middleware,
      quizApi.middleware,
      reviewApi.middleware,
      userQuizApi.middleware,
      forumApi.middleware,
      rtkQueryErrorLogger,
      AuthMiddleware,
    ]),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
