import AddIcon from '@mui/icons-material/Add';
import { Button, Grid } from '@mui/material';
import { textBookClient } from 'apis';
import { getTrProps } from 'common/utils/tableUtils';
import SearchTextField from 'components/Filters/SearchTextField';
import Table from 'components/Table';
import { ITableRequest } from 'components/Table/types';
import { ChangeEvent, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { unitListColumns } from '../TextBookManagement/utils';
import { initialUnitListState, unitListReducer } from './reducer';

interface UnitListProps {
  textBookId: number;
}

export const UnitListContainer = ({ textBookId }: UnitListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(unitListReducer, initialUnitListState);
  const { isLoading, unitList, query } = state;

  useDebounce(
    () => {
      dispatch({ type: 'unitList.request' });
      const loadData = async () => {
        try {
          const res = await textBookClient.getUnitsWithPagination(
            textBookId,
            query.searchKey,
            query.pageNumber,
            query.pageSize,
            query.sortCriteria
          );
          dispatch({ type: 'unitList.loaded', payload: res });
        } catch (err: any) {
          dispatch({ type: 'unitList.error', payload: err });
        }
      };
      loadData();
    },
    300,
    [query]
  );

  const onChangeSearchKey = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'unitList.updateFilter',
      payload: { ...query, pageNumber: 1, searchKey: event.target.value }
    });
  };

  return (
    <>
      <Grid container direction="row" spacing={2} sx={{ my: 2 }}>
        <Grid item xs={12} sm={3}>
          <SearchTextField placeholder={t('search')} onChange={onChangeSearchKey} fullWidth />
        </Grid>
        <Grid item xs={12} sm={9} sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/text-books/${textBookId}/units/new`)}
          >
            {t('textBook.newUnit')}
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Table
            columns={unitListColumns}
            pageIndex={query.pageNumber - 1}
            pageSize={query.pageSize}
            result={unitList}
            onManualLoadingTableData={(request: ITableRequest) => {
              const { pageIndex, pageSize, sortCriteria } = request;

              dispatch({
                type: 'unitList.updateFilter',
                payload: {
                  ...query,
                  searchKey: query.searchKey,
                  pageNumber: pageIndex + 1,
                  pageSize,
                  sortCriteria
                }
              });
            }}
            getTrProps={getTrProps((original: any) => () => navigate(`/units/${original.id}`))}
            loading={isLoading}
            defaultSorted={query.sortCriteria}
            enableSorting
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UnitListContainer;
