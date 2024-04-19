import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

export interface AuthState {
  username: string | null;
  token: string | null;
  isActive: boolean
}

const initialState: AuthState = {
  username: "",
  token: "",
  isActive: false,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) => {

      const auth =  JSON.stringify({
          username: action.payload.username,
          token: action.payload.token,
          isActive: true,
      })
      Cookies.set('user', auth, { expires: 1 });  
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isActive = true
    },
    logout: () => {
      localStorage.clear();
      Cookies.remove("user");
      return { ...initialState };
    },
  },
});

export const { setCredential, logout } = auth.actions;

export default auth.reducer;
