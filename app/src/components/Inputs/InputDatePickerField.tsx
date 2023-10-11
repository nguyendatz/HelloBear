import { DatePickerProps } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { ForwardedRef } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

type IProps<T extends FieldValues> = {
  name: string;
  control: Control<T>;
  label?: string | React.ReactNode;
  value?: any;
  fullWidth?: boolean;
  initValue?: boolean;
  required?: boolean;
  disabled?: boolean;
} & Partial<DatePickerProps<Date>>;

export const InputDatePickerField = React.forwardRef((props: IProps<any>, ref: ForwardedRef<HTMLElement>) => {
  const {
    name = 'time',
    control,
    label = '',
    fullWidth = false,
    disabled = false,
    required = false,
    ...otherProps
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <DatePicker
            {...field}
            {...otherProps}
            label={label}
            value={field.value !== null ? new Date(field.value) : null}
            slotProps={{
              textField: {
                helperText: error?.message,
                error: Boolean(error),
                InputLabelProps: {
                  shrink: true
                },
                fullWidth,
                sx: {
                  '.MuiOutlinedInput-root.MuiInputBase-root ': {
                    background: '#FFF'
                  }
                },
                inputRef: ref,
                required
              }
            }}
            disabled={disabled}
          />
        );
      }}
    />
  );
});

export default InputDatePickerField;
