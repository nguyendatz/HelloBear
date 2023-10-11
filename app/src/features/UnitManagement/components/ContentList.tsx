/* eslint-disable react/prop-types */
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Box, Button, Grid, MenuItem, TableRowProps } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { contentClient } from 'apis';
import axios, { CancelToken } from 'axios';
import useDialog from 'common/hooks/useDialog';
import useInitialQueryFromSearchParams from 'common/hooks/useInitialQueryFromSearchParams';
import useSearchParamsWithQuery from 'common/hooks/useSearchParamsWithQuery';
import { formatStr } from 'common/utils/stringUtils';
import { getTrProps } from 'common/utils/tableUtils';
import { showNotification } from 'common/utils/toastNotification';
import BackdropLoader from 'components/BackdropLoader';
import SearchTextField from 'components/Filters/SearchTextField';
import Table from 'components/Table';
import ThreeDotsMenu from 'components/ThreeDotsMenu';
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { contentListReducer, initialContentListQuery, initialContentListState } from '../reducer';

interface IProps {
  unitId: number;
  textBookId?: number;
  isEdit?: boolean;
}

const ContentList = ({ unitId }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const queryFromSearchParams = useInitialQueryFromSearchParams({ ...initialContentListQuery, lessonId: unitId });
  const [state, dispatch] = useReducer(contentListReducer, {
    ...initialContentListState,
    query: queryFromSearchParams
  });
  const { contentList, query, isLoading, isSaving } = state;
  useSearchParamsWithQuery(query);

  const dialog = useDialog();
  const [searchText, setSearchText] = useState(query.searchKey);
  useDebounce(
    () => {
      if (query.searchKey !== searchText) {
        dispatch({
          type: 'contentList.updateFilter',
          payload: { ...query, pageNumber: 1, searchKey: searchText, lessonId: unitId }
        });
      }
    },
    300,
    [searchText]
  );
  const loadData = useCallback(
    async (cancelToken?: CancelToken) => {
      try {
        dispatch({ type: 'contentList.request' });
        const res = await contentClient.getContentsWithPagination(
          query.lessonId,
          query.searchKey,
          query.pageNumber,
          query.pageSize,
          query.sortCriteria,
          cancelToken
        );
        dispatch({ type: 'contentList.loaded', payload: res });
      } catch (err: any) {
        dispatch({ type: 'contentList.error', payload: err });
      }
    },
    [query]
  );

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    loadData(cancelToken.token);

    return () => {
      cancelToken.cancel();
    };
  }, [loadData]);

  const onChangeSearchKey = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleClickRow = (original: TableRowProps) => () => {
    navigate(`/contents/${original.id}`);
  };

  const handleDeleteUnit = useCallback(
    async (original: any) => {
      const { name, id } = original;
      const res: any = await dialog.message({
        title: '',
        message: formatStr(t('content.deleteAlert'), name ?? '')
      });
      if (res.success) {
        dispatch({ type: 'contentList.isSaving', payload: true });

        try {
          await contentClient.delete(id ?? '');
          dispatch({
            type: 'contentList.updateFilter',
            payload: { ...query }
          });
        } catch (err: any) {
          dispatch({ type: 'contentList.error', payload: err });
        }

        dispatch({ type: 'contentList.isSaving', payload: false });
      }
    },
    [dialog, query, t]
  );

  const handleExportQrCodeContents = async () => {
    try {
      const response = await contentClient.exportQrCode(unitId);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const fileName = response.fileName ?? `unit-${unitId}.zip`;
      const link = document.createElement('a');
      link.setAttribute('download', fileName);
      link.href = url;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);

      showNotification({ message: t('content.exportedSuccess'), severity: 'success', autoHideDuration: 2000 });
    } catch (err: any) {
      dispatch({ type: 'contentList.error', payload: err });
    }
  };

  const columnHelper = createColumnHelper<any>();

  const contentListColumns = useMemo(
    () => [
      columnHelper.display({
        header: t('content.number'),
        id: 'No',
        cell: (props) => {
          const { index } = props.row;
          return <Box>{index + 1}</Box>;
        }
      }),
      columnHelper.accessor('name', {
        header: t('content.name')
      }),
      columnHelper.accessor('pageNumber', {
        header: t('content.pageNumber')
      }),
      columnHelper.display({
        id: 'actions',
        cell: (props) => {
          const { original } = props.row;

          return (
            <ThreeDotsMenu>
              <MenuItem onClick={() => handleDeleteUnit(original)}>{t('content.delete')}</MenuItem>
            </ThreeDotsMenu>
          );
        }
      })
    ],
    [columnHelper, handleDeleteUnit, t]
  );

  return (
    <Box>
      {isSaving && <BackdropLoader isOpen={isSaving} />}
      <Grid container direction="row" spacing={2} sx={{ my: 2 }}>
        <Grid item xs={12} sm={6}>
          <SearchTextField
            value={searchText}
            placeholder={t('search')}
            onChange={onChangeSearchKey}
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={<ImportExportIcon />}
            onClick={handleExportQrCodeContents}
            disabled={isLoading}
            sx={{ mr: 2 }}
          >
            {t('content.export')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/units/${unitId}/contents/new`)}
            disabled={isLoading}
          >
            {t('common.add')}
          </Button>
        </Grid>
      </Grid>

      {!isLoading && (
        <Grid container direction="row">
          <Grid item xs={12}>
            <Table
              columns={contentListColumns}
              pageIndex={query.pageNumber - 1}
              pageSize={query.pageSize}
              result={contentList}
              onManualLoadingTableData={({ pageIndex, pageSize, sortCriteria }) => {
                dispatch({
                  type: 'contentList.updateFilter',
                  payload: {
                    ...query,
                    searchKey: query.searchKey,
                    pageNumber: pageIndex + 1,
                    pageSize,
                    sortCriteria
                  }
                });
              }}
              getTrProps={getTrProps(handleClickRow)}
              loading={isLoading}
              defaultSorted={query.sortCriteria}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ContentList;
