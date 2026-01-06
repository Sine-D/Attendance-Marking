import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
  },
});

export const { setStudents } =
  studentSlice.actions;
export default studentSlice.reducer;
