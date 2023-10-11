import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import CustomCheckBoxOption from 'components/Inputs/CustomCheckBoxOption';
import AppDatePicker from 'components/Inputs/DatePicker';
import AppSelect from 'components/Inputs/Select';
import { Control, FieldValues, UseFormReturn, useController } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { IFormFieldItem, IOptionField } from 'types/FormGenerator';

const commonFormControlProps = {
  margin: 'dense',
  fullWidth: true
};

const commonTextFieldProps = {
  InputLabelProps: { shrink: true },
  ...commonFormControlProps
};

interface IProps {
  field: Omit<IFormFieldItem, 'selfLayout'> & any;
  control: Control<FieldValues, any>;
  formInstance: Omit<UseFormReturn<any>, 'handleSubmit' | 'watch'>;
}

export const FormInputSelector = (props: IProps) => {
  const { field, control, formInstance } = props;
  const {
    id,
    name,
    type,
    label,
    data,
    filterData,
    required,
    readOnly = false,
    multiline = false,
    rows,
    rules = {},
    propsDependsOnValue = () => {},
    helperText,
    defaultValue,
    regex,
    ...otherProps
  } = field;

  const controller = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue === undefined ? null : defaultValue
  });

  const {
    field: { onChange, onBlur, value, ref },
    fieldState
  } = controller;

  const { error } = fieldState;
  const formValues = formInstance.getValues();
  const fieldHelperText = (typeof helperText === 'function' ? helperText(formValues, data) : helperText) || '';

  const commonProps = {
    id: id || name,
    name,
    label,
    type,
    required,
    error: Boolean(error),
    helperText: error?.message ?? fieldHelperText
  };

  if (type === 'select') {
    return (
      <AppSelect
        {...{ ...commonTextFieldProps, ...commonProps, ...otherProps, ...propsDependsOnValue(formValues) }}
        value={value}
        options={data}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        inputRef={ref}
      />
    );
  }

  if (type === 'checkbox' || type === 'switch') {
    const ComponentControl = type === 'switch' ? Switch : Checkbox;
    return (
      <FormControl
        {...{ ...commonFormControlProps, ...otherProps, ...propsDependsOnValue(formValues) }}
        sx={{ width: 'auto' }}
      >
        <FormControlLabel
          label={label}
          control={
            <ComponentControl
              id={id || name}
              onChange={onChange}
              checked={value}
              inputRef={ref}
              size="medium"
              disabled={readOnly}
            />
          }
        />
      </FormControl>
    );
  }

  if (type === 'radio') {
    return (
      <FormControl {...{ ...commonFormControlProps, ...otherProps, ...propsDependsOnValue(formValues) }}>
        <FormLabel>{label}</FormLabel>
        <RadioGroup row name={name} onChange={onChange} value={value} ref={ref}>
          {(data ?? []).map((x: any) => {
            return <FormControlLabel disabled={readOnly} key={x.id} value={x.id} control={<Radio />} label={x.name} />;
          })}
        </RadioGroup>
      </FormControl>
    );
  }

  if (type === 'date') {
    return (
      <AppDatePicker
        {...{ ...commonTextFieldProps, ...commonProps, ...otherProps, ...propsDependsOnValue(formValues) }}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        ref={ref}
      />
    );
  }

  if (type === 'autocomplete') {
    const { label, required, error, helperText, ...restCommprops } = commonProps;
    const { ...restCommonTextFieldProps } = commonTextFieldProps;
    const { multiple, ...restOtherProps } = otherProps;

    const filteredData = filterData ? filterData(data, formValues) : data;
    const selectedOptions = filteredData.filter((option: IOptionField) =>
      multiple ? (value || []).some((x: IOptionField) => x.id === option.id) : option.id === value
    );
    const selectedOption = multiple ? selectedOptions : selectedOptions[0] || null;

    return (
      <Autocomplete
        size="small"
        multiple={multiple}
        disableCloseOnSelect={multiple}
        options={filteredData}
        value={selectedOption}
        defaultValue={defaultValue === undefined ? (multiple ? [] : null) : defaultValue}
        sx={{ mt: 1 }}
        getOptionLabel={(option: IOptionField) => option.name ?? ''}
        onChange={(e, newOption: IOptionField) => {
          const newValue = multiple ? newOption || [] : newOption?.id || '';
          onChange(newValue);
        }}
        onBlur={() => {
          if (!value) {
            onChange('');
          }
        }}
        ref={ref}
        readOnly={readOnly}
        renderInput={(params) => {
          return <TextField required={required} label={label} error={error} helperText={helperText} {...params} />;
        }}
        renderOption={
          multiple
            ? (props, option, { selected }) => {
                return CustomCheckBoxOption(props, option, { selected }, 'name');
              }
            : undefined
        }
        {...{ ...restCommonTextFieldProps, ...restCommprops, ...restOtherProps, ...propsDependsOnValue(formValues) }}
      />
    );
  }

  if (type === 'image') {
    return (
      value && (
        <Box component="div" sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src={value}
            width={otherProps.width}
            height={otherProps.height}
            sx={{ objectFit: 'cover' }}
          />
        </Box>
      )
    );
  }

  if (type === 'file') {
    return (
      <FormControl margin="dense">
        <FormLabel htmlFor={name}>
          <input
            name={name}
            id={name}
            accept="image/*"
            type="file"
            ref={ref}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target?.files && e.target.files[0];

              if (file) {
                onChange(file);
              }
            }}
          />
          <Button variant="contained" component="span" endIcon={<CloudUploadIcon />}>
            {label}
          </Button>
          {' ' + (value?.name ?? '')}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </FormLabel>
      </FormControl>
    );
  }

  if (type === 'phone') {
    return (
      <FormControl {...{ ...commonFormControlProps, ...otherProps, ...propsDependsOnValue(formValues) }}>
        <PatternFormat
          format={otherProps.format}
          valueIsNumericString={true}
          customInput={TextField}
          label={label}
          InputProps={otherProps.inputProps}
          InputLabelProps={{ shrink: true }}
          placeholder={otherProps.placeholder}
          onValueChange={(values) => onChange(values.value)}
          onBlur={onBlur}
          value={value}
          mask="_"
          fullWidth
          error={Boolean(error)}
        />
        {error && <FormHelperText error>{error.message}</FormHelperText>}
      </FormControl>
    );
  }

  const inputProps: any = { ...commonTextFieldProps, ...commonProps };

  if (regex) {
    inputProps.onKeyDown = (event: any) => {
      if (!regex.test(event.key) && event.key !== 'Backspace') {
        event.preventDefault();
      }
    };
  }

  return (
    <TextField
      {...inputProps}
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      {...otherProps}
      inputProps={{ readOnly: readOnly, ...otherProps.inputProps }}
      {...propsDependsOnValue(formValues)}
    />
  );
};

export default FormInputSelector;
