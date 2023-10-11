import { Box } from '@mui/material';
import SearchTextField from 'components/Filters/SearchTextField';
import SelectFilterField from 'components/Filters/SelectFilterField';
import { ChangeEvent, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { classListReducer, initialClassListState } from '../class-reducer';
import { ClassListQuery } from '../types';
import { ClassStatusEnumLabels, ClassStatusOptions } from '../utils';

const ClassFilter = () => {
  const [state, dispatch] = useReducer(classListReducer, initialClassListState);
  const { query } = state;
  const { t } = useTranslation();
  const onChangeSearchKey = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'classList.updateFilter', payload: { ...query, searchKey: event.target.value } });
  };
  const onChangeFilter = (values: string[] | null, name: keyof ClassListQuery) => {
    dispatch({ type: 'classList.updateFilter', payload: { ...query, [name]: values } });
  };
  return (
    <Box>
      <SearchTextField value={query.searchKey} placeholder={t('search')} onChange={onChangeSearchKey} />
      <SelectFilterField
        options={ClassStatusOptions}
        selectedValues={query.status}
        onChange={(values) => onChangeFilter(values, 'status')}
        name={t('classManagement.status')}
        multiple
        objectEnumLabel={ClassStatusEnumLabels}
      />
    </Box>
  );
};

export default ClassFilter;
