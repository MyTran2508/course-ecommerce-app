import { QuizType } from "@/utils/resources";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuizState {
  typeQuizCreate: QuizType | null;
  isEdit: boolean;
  quiz: {
    exQuizId: string;
    userQuizId: string;
    expiryTime: number;
  }[];
}

const initialState: QuizState = {
  typeQuizCreate: null,
  isEdit: false,
  quiz: [],
};

export const quiz = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setTypeQuizCreate: (state, action: PayloadAction<QuizType | null>) => {
      state.typeQuizCreate = action.payload;
    },
    setQuestionIsEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
    setUserQuiz: (
      state,
      action: PayloadAction<{
        exQuizId: string;
        userQuizId: string;
        expiryTime: number;
      }>
    ) => {
      const { exQuizId, userQuizId, expiryTime } = action.payload;
      const existingQuiz = state.quiz.find((q) => q.exQuizId === exQuizId);
      if (existingQuiz) {
        existingQuiz.userQuizId = userQuizId;
        existingQuiz.expiryTime = expiryTime;
      } else {
        state.quiz.push({ exQuizId, userQuizId, expiryTime });
      }
    },
    deleteUserQuiz: (state, action: PayloadAction<string>) => {
      console.log("đã zô");
      state.quiz = state.quiz.filter((q) => q.exQuizId !== action.payload);
    },
  },
});

export const {
  setTypeQuizCreate,
  setQuestionIsEdit,
  setUserQuiz,
  deleteUserQuiz,
} = quiz.actions;

export default quiz.reducer;
