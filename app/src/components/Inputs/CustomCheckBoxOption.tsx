import { AutocompleteRenderOptionState, Checkbox } from '@mui/material';
import _get from 'lodash/get';

import { FilterSelectOption } from 'types/Common';
import { IOptionField } from 'types/FormGenerator';

const CustomCheckBoxOption: (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: IOptionField | FilterSelectOption,
  state: Partial<AutocompleteRenderOptionState>,
  labelField?: string
) => React.ReactNode = (props, option, { selected }, labelField = 'label') => {
  return (
    <li {...props}>
      <Checkbox style={{ marginRight: 8 }} checked={selected} />
      {_get(option, labelField)}
    </li>
  );
};

export default CustomCheckBoxOption;
