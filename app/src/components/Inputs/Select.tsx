import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import React from 'react';

interface IProps {
  label: string | React.ReactNode;
  value?: any;
  helperText?: string;
  options?: { [k: string]: any }[];
  fullWidth?: boolean;
  valueFieldName?: string;
  labelFieldName?: string;
  multiple?: boolean;
  onChange?: (value: any) => void;
  readOnly?: boolean;
  [k: string]: any;
}

export const AppSelect = React.forwardRef((props: IProps, ref) => {
  const {
    label,
    fullWidth = true,
    options = [],
    helperText,
    valueFieldName = 'id',
    labelFieldName = 'name',
    multiple = false,
    onChange,
    value,
    readOnly,
    ...otherProps
  } = props;

  const handleChange = (event: any) => {
    const {
      target: { value }
    } = event;

    if (!multiple) {
      if (onChange) {
        onChange(value);
      }
      return;
    }

    const uniqueIdList = new Set(value);
    const selectedItems = options.filter((x) => uniqueIdList.has(x.id));

    if (onChange) {
      onChange(selectedItems);
    }
  };

  const inputProps = multiple
    ? {
        multiple,
        renderValue: (selected: Array<number | string>) => {
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.sort().map((value: number | string) => {
                const option = options.find((x) => value === x.id);

                return <Chip key={option?.id} label={option?.name} />;
              })}
            </Box>
          );
        }
      }
    : undefined;

  const selectedValue = multiple ? value.map((x: any) => x[valueFieldName]) : value;

  return (
    <TextField
      fullWidth={fullWidth}
      select
      label={label}
      helperText={helperText}
      inputRef={ref}
      inputProps={inputProps}
      onChange={handleChange}
      value={selectedValue}
      size="small"
      disabled={readOnly}
      {...otherProps}
    >
      {options.map((option) => (
        <MenuItem key={option[valueFieldName]} value={option[valueFieldName]}>
          {multiple ? (
            <>
              <Checkbox checked={selectedValue.includes(option[valueFieldName])} />
              <ListItemText primary={option[labelFieldName]} />
            </>
          ) : option.inactive ? (
            <span style={{ opacity: 0.4 }}>{option[labelFieldName]}</span>
          ) : (
            option[labelFieldName]
          )}
        </MenuItem>
      ))}
    </TextField>
  );
});

export default AppSelect;
