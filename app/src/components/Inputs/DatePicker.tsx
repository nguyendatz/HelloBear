import TextField, { TextFieldProps } from '@mui/material/TextField';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import React from 'react';

interface IProps {
  label?: string;
  name: string;
  required?: boolean;
  maxDate?: unknown;
  minDate?: unknown;
  value: any;
  onChange: any;
  readOnly?: boolean;
  rootProps?: any;
  helperText?: string;
  includeTime?: boolean;
}

export const AppDatePicker = React.forwardRef((props: IProps, ref) => {
  const {
    label,
    value,
    readOnly = true,
    onChange,
    minDate,
    maxDate,
    rootProps,
    helperText,
    includeTime = false,
    ...otherProps
  } = props ?? {};

  const Picker = includeTime ? DateTimePicker : DatePicker;

  return (
    <Picker
      label={label}
      value={value}
      maxDate={maxDate}
      minDate={minDate}
      onChange={onChange}
      {...rootProps}
      renderInput={(params: TextFieldProps) => {
        const { inputProps, ...restProps } = params;

        return (
          <TextField
            {...restProps}
            {...otherProps}
            helperText={helperText}
            inputProps={{ ...inputProps, readOnly, inputRef: ref }}
          />
        );
      }}
    />
  );
});

export default AppDatePicker;
