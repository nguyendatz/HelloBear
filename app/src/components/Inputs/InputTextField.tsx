import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Control, Controller, FieldValues } from 'react-hook-form';

type InputTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
} & TextFieldProps;

const InputTextField = ({ name = 'text', control, ...props }: InputTextFieldProps<any>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextField
          fullWidth
          error={Boolean(error)}
          helperText={error?.message}
          inputRef={ref}
          {...props}
          {...field}
          onChange={(e) => {
            field.onChange(e);
            if (typeof props.onChange === 'function') {
              props.onChange(e);
            }
          }}
        />
      )}
    />
  );
};

export default InputTextField;
