import { updateCourse } from '@/redux/features/courseSlice';
import { Section } from "@/types/section.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ContentState {
  section: Section[]
  updateSection: boolean
}

const initialState: ContentState = {
  section: [],
  updateSection: false
}

export const section = createSlice({
  name: "section",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.section = action.payload
    },
    updateSection: (state) => {
      state.updateSection = !state.updateSection
    }
  },
});

export const {setSections, updateSection} = section.actions;

export default section.reducer;
