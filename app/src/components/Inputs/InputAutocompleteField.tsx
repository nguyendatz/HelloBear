import { Autocomplete, Checkbox } from '@mui/material';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import TextField from '@mui/material/TextField';
import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

type IProps<T extends FieldValues> = {
  name: string;
  control: Control<T>;
  label: string | React.ReactNode;
  value?: any;
  options?: { [k: string]: any }[];
  ListboxProps?: object;
  fullWidth?: boolean;
  multiple?: boolean;
  required?: boolean;
  valueFieldName?: string;
  labelFieldName?: string;
  initValue?: boolean;
  [key: string]: any;
  onInputKeyChange?: (value: string) => void;
};

export const InputAutocompleteField = React.forwardRef((props: IProps<any>, ref) => {
  const {
    name = 'select',
    control,
    label,
    ListboxProps = {},
    fullWidth = true,
    required = false,
    multiple = false,
    options = [],
    valueFieldName = 'value',
    labelFieldName = 'label',
    onInputKeyChange,
    ...otherProps
  } = props;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  function verifyMappingValue(field: any, fieldValue: any) {
    const componentValue = options.find((o) => o[valueFieldName] === fieldValue) || null;
    if (componentValue === null) {
      field.onChange('');
    }
  }
  const id = `input-autocomplete-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value: fieldValue, ...field }, fieldState: { error } }) => {
        const componentValue = multiple ? fieldValue : (options.find((o) => o[valueFieldName] === fieldValue) ?? null);
        return (
          <Autocomplete
            id={id}
            multiple={multiple}
            disablePortal
            options={options}
            fullWidth={fullWidth}
            value={componentValue}
            getOptionLabel={(option) => {
              if (multiple) {
                return options.find((o) => o[valueFieldName] === option)?.[labelFieldName] || '';
              }
              return option[labelFieldName] || '';
            }}
            isOptionEqualToValue={(option, value) => {
              if (multiple) return option[valueFieldName] === value;
              return value ? option[valueFieldName] === value[valueFieldName] : true;
            }}
            renderInput={(params) => (
              <TextField
                label={label}
                inputRef={ref}
                required={required}
                error={Boolean(error)}
                helperText={error?.message}
                value={fieldValue}
                {...params}
                {...field}
              />
            )}
            renderOption={(props, option, { selected }) => {
              return (
                <li {...props} key={option[valueFieldName]}>
                  {multiple && (
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  )}
                  {option[labelFieldName]}
                </li>
              );
            }}
            onChange={(_, newValue) => {
              const value = multiple
                ? newValue.map((v: { [k: string]: string } | string | number) => {
                    if (typeof v === 'string' || typeof v === 'number') return v;
                    return v[valueFieldName];
                  })
                : newValue
                ? newValue[valueFieldName]
                : null;
              field.onChange(value);
            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                verifyMappingValue(field, fieldValue);
              }
            }}
            onInputChange={(event, value) => {
              if (event && onInputKeyChange) {
                onInputKeyChange(value);
              }
            }}
            ListboxProps={ListboxProps}
            {...otherProps}
          />
        );
      }}
    />
  );
});

export default InputAutocompleteField;
