import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ContentState {
  contentId: string
}

const initialState: ContentState = {
  contentId: ""
}

export const content = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContentId: (state, action: PayloadAction<string>) => {
      state.contentId = action.payload
    },
  },
});

export const {setContentId} = content.actions;

export default content.reducer;
