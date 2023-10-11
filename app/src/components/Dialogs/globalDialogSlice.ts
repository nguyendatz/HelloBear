import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentType } from 'react';

// Define a type for the slice state
interface GlobalDialogProp<T> {
  id: number;
  component: ComponentType<T>;
  props: object;
}

interface GlobalDialogState<T> {
  dialogs: GlobalDialogProp<T>[];
}

// Define the initial state using that type
const initialState: GlobalDialogState<unknown> = {
  dialogs: []
};

export const globalDialogSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<GlobalDialogProp<unknown>>) => {
      if (action.payload) {
        state.dialogs = [...state.dialogs, action.payload];
      }
    },
    closeDialog: (state, action: PayloadAction<number>) => {
      state.dialogs = state.dialogs.filter((x) => x.id !== action.payload);
    }
  }
});

export const { openDialog, closeDialog } = globalDialogSlice.actions;

export default globalDialogSlice.reducer;
