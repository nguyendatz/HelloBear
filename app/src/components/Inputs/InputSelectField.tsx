import { Checkbox, ListItemText, SelectProps } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React, { ForwardedRef } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type IProps<T extends FieldValues> = TextFieldProps & {
  name: string;
  control: Control<T>;
  label?: string | React.ReactNode;
  multiple?: boolean;
  value?: any;
  options?: { [k: string]: any }[];
  fullWidth?: boolean;
  valueFieldName?: string;
  labelFieldName?: string;
  initValue?: boolean;
  selectProps?: Partial<SelectProps<unknown>>;
};

export const InputSelectField = React.forwardRef(
  <T extends object>(props: IProps<T>, ref: ForwardedRef<HTMLElement>) => {
    const {
      name,
      control,
      label,
      fullWidth = true,
      multiple = false,
      options = [],
      valueFieldName = 'value',
      labelFieldName = 'label',
      selectProps = {},
      ...otherProps
    } = props;
    const renderValueText = (selected: string[] | any) => {
      if (!multiple) return `${options.find((o) => o.value === selected)?.label || ''}`;
      const labels = selected.map((value: string) => {
        return `${options.find((o) => o.value === value)?.label}` || '';
      });
      return labels.join(', ');
    };
    return (
      <Controller
        control={control}
        name={name as Path<T>}
        render={({ field, fieldState: { error } }) => {
          const selectedValue = multiple ? (field.value || []).map((x: any) => x[valueFieldName]) : field.value;
          return (
            <TextField
              {...field}
              {...otherProps}
              onChange={(e) => {
                field.onChange(e);
                if (typeof otherProps.onChange === 'function') {
                  otherProps.onChange(e);
                }
              }}
              fullWidth={fullWidth}
              select
              label={label}
              inputRef={ref}
              error={Boolean(error)}
              helperText={error?.message}
              SelectProps={{
                ...selectProps,
                multiple,
                native: false,
                renderValue: (value: any) => renderValueText(value)
              }}
            >
              {options.map((option) => (
                <MenuItem key={option[valueFieldName]} value={option[valueFieldName]}>
                  {multiple ? (
                    <>
                      <Checkbox checked={selectedValue.includes(option[valueFieldName])} />
                      <ListItemText primary={option[labelFieldName]} />
                    </>
                  ) : (
                    option[labelFieldName]
                  )}
                </MenuItem>
              ))}
            </TextField>
          );
        }}
      />
    );
  }
);

export default InputSelectField;
