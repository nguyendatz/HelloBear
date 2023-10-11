import { Close } from '@mui/icons-material';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlProps,
  InputLabel,
  InputLabelProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuProps,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SelectProps
} from '@mui/material';
import { IOption } from 'common/types/IOption';
import { useTranslation } from 'react-i18next';
const menuProps = {
  // getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  variant: 'menu'
} as unknown as MenuProps;

export type SelectFilterOptions = IOption[];

export interface SelectFilterProps {
  options: SelectFilterOptions;
  selectedValues: string[] | null | undefined;
  name: string;
  onChange: (values: string[] | null) => void;
  objectEnumLabel?: Record<string, string>;
  formControlProps?: FormControlProps;
  inputLabelProps?: InputLabelProps;
  multiple?: boolean;
  selectProps?: SelectProps<string[]>;
}

const SelectFilterField = ({
  options,
  selectedValues,
  name,
  onChange,
  objectEnumLabel,
  multiple,
  formControlProps: { sx: formControlSxProps, ...formControlProps } = {},
  inputLabelProps: { sx: inputLabelSxProps, ...inputLabelProps } = {},
  selectProps: { sx: selectSxProps, ...selectProps } = {}
}: SelectFilterProps) => {
  const { t } = useTranslation();
  const isAllSelected = multiple
    ? !selectedValues || (options.length > 0 && selectedValues && selectedValues.length === options.length)
    : false;
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event;
    const lastValue = value[value.length - 1];
    if (lastValue === 'all') {
      onChange(null);
      return;
    }

    if (lastValue === 'clear') {
      onChange([]);
      return;
    }
    if (!selectedValues) {
      const tempAllValues = options.map((option) => option.value).filter((v) => v !== lastValue);
      onChange(tempAllValues);
      return;
    }

    if (value.length === options.length) {
      onChange(null); // null is all options (define from API Client)
      return;
    }

    onChange(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const id = `multiple-select-filter-${name}`;

  const renderValue = (selected: string[]) => {
    if (isAllSelected) {
      return t('all');
    }

    const labels = selected.map((value) => {
      if (objectEnumLabel && objectEnumLabel[value]) {
        return t(`${objectEnumLabel[value]}`);
      }

      return t(`${options.find((o) => o.value === value)?.label}`) || '';
    });

    return labels.join(', ');
  };
  return (
    <FormControl sx={{ ...formControlSxProps }} fullWidth {...formControlProps}>
      <InputLabel id={`${id}-label`} shrink sx={{ ...inputLabelSxProps }} {...inputLabelProps}>
        {name}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        multiple={multiple}
        value={selectedValues || []}
        displayEmpty
        onChange={handleChange}
        input={<OutlinedInput label={name} />}
        renderValue={renderValue}
        MenuProps={menuProps}
        sx={{
          '.MuiOutlinedInput-notchedOutline': {
            legend: {
              maxWidth: 'unset'
            }
          },
          ...selectSxProps
        }}
        {...selectProps}
      >
        {multiple && (
          <MenuItem value="all">
            <ListItemIcon sx={{ color: 'text.main' }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={
                  !!selectedValues &&
                  selectedValues.length > 0 &&
                  selectedValues.length < options.length &&
                  !isAllSelected
                }
              />
            </ListItemIcon>
            <ListItemText primary={t('selectAll')} />
          </MenuItem>
        )}

        {multiple && (
          <MenuItem value="clear">
            <ListItemIcon sx={{ p: '9px', color: 'text.main' }}>
              <Close />
            </ListItemIcon>
            <ListItemText primary={t('clearAll')} />
          </MenuItem>
        )}

        {multiple && <Divider />}

        {options.map((option) => {
          const selected = (selectedValues && selectedValues.indexOf(option.value) > -1) || isAllSelected;
          return (
            <MenuItem key={option.value} value={option.value} className={selected ? 'Mui-selected' : ''}>
              {multiple && <Checkbox checked={selected} />}
              <ListItemText primary={option.label} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectFilterField;
