import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudentProfile } from 'apis/nswag';

// Define a type for the slice state
interface IStudentState {
  info: StudentProfile | null;
}

const initialState: IStudentState = {
  info: null
};

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<StudentProfile>) => {
      if (action.payload) {
        state.info = action.payload;
      }
    }
  }
});

export const { login } = studentSlice.actions;

export default studentSlice.reducer;
