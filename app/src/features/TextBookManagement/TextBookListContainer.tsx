import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, MenuItem } from '@mui/material';
import { CoreRow, createColumnHelper } from '@tanstack/react-table';
import { textBookClient } from 'apis';
import { TextBookQueryResponse } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import axios, { CancelToken } from 'axios';
import useDialog from 'common/hooks/useDialog';
import useInitialQueryFromSearchParams from 'common/hooks/useInitialQueryFromSearchParams';
import useSearchParamsWithQuery from 'common/hooks/useSearchParamsWithQuery';
import { formatStr } from 'common/utils/stringUtils';
import SearchTextField from 'components/Filters/SearchTextField';
import Table from 'components/Table';
import { ITableRequest } from 'components/Table/types';
import ThreeDotsMenu from 'components/ThreeDotsMenu';
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { initialTextBookListState, initialTextBookQuery, textBookListReducer } from './reducer';

const TextBookListContainer = () => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const navigate = useNavigate();
  const queryFromSearchParams = useInitialQueryFromSearchParams(initialTextBookQuery);
  const [{ query, textbooks, isLoading }, dispatch] = useReducer(textBookListReducer, {
    ...initialTextBookListState,
    query: queryFromSearchParams
  });
  useSearchParamsWithQuery(query);
  const [searchText, setSearchText] = useState(query.searchKey);
  useDebounce(
    () => {
      if (query.searchKey !== searchText) {
        dispatch({ type: 'textBookList.updateFilter', payload: { ...query, pageNumber: 1, searchKey: searchText } });
      }
    },
    300,
    [searchText]
  );

  const confirmDialog = useCallback(
    async (msg: string, callback: () => Promise<void>) => {
      const res = await dialog.message({
        title: '',
        message: msg
      });
      if (res.success) {
        await callback();
      }
    },
    [dialog]
  );

  const handleDelete = useCallback(
    async (original: TextBookQueryResponse) => {
      const { id } = original;
      dispatch({ type: 'textBookList.loading' });

      try {
        await textBookClient.delete(id ?? 0);
        dispatch({
          type: 'textBookList.updateFilter',
          payload: { ...query }
        });
      } catch (err: any) {
        dispatch({ type: 'textBookList.error', payload: err });
      }
    },
    [query]
  );

  const columnHelper = createColumnHelper<TextBookQueryResponse>();
  const textBookListColumns = useMemo(
    () => [
      columnHelper.accessor('thumbnail', {
        header: t('textBookManagement.thumbnail'),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.thumbnail && (
            <Box component="img" src={row.original.thumbnail} width={150} height={150} sx={{ objectFit: 'cover' }} />
          )
      }),
      columnHelper.accessor('name', {
        header: t('textBookManagement.name')
      }),
      columnHelper.accessor('description', {
        header: t('textBookManagement.description')
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
          const { original } = row;

          return !original.hasClasses ? (
            <ThreeDotsMenu>
              <MenuItem
                onClick={() =>
                  confirmDialog(formatStr(t('textBookManagement.deleteAlert'), original.name ?? ''), () =>
                    handleDelete(original)
                  )
                }
              >
                {t('common.delete')}
              </MenuItem>
            </ThreeDotsMenu>
          ) : (
            <></>
          );
        }
      })
    ],
    [t, columnHelper, confirmDialog, handleDelete]
  );
  const getTrProps = (row: CoreRow<any>): object => {
    return {
      onClick: () => {
        navigate(`/text-books/${row.original.id}`);
      }
    };
  };
  const onChangeSearchKey = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const onAddTextbook = () => {
    navigate('/text-books/new');
  };
  const queryTextbooks = useCallback(
    async (cancelToken?: CancelToken) => {
      dispatch({ type: 'textBookList.loading' });
      try {
        const queryResponses = await textBookClient.getTextBooksWithPagination(
          query.searchKey,
          query.pageNumber,
          query.pageSize,
          query.sortCriteria,
          cancelToken
        );
        dispatch({ type: 'textBookList.loaded', payload: queryResponses });
      } catch (e) {
        dispatch({ type: 'textBookList.error' });
      }
    },
    [query, dispatch]
  );

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    queryTextbooks(cancelToken.token);

    return () => {
      cancelToken.cancel();
    };
  }, [queryTextbooks]);
  return (
    <AdminPageLayout id="TextBookManagement" title={t('textBookManagement.title')}>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={3}>
          <SearchTextField value={searchText} placeholder={t('search')} onChange={onChangeSearchKey} fullWidth />
        </Grid>
        <Grid item xs={12} md={9} sx={{ textAlign: 'right' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddTextbook} disabled={isLoading}>
            {t('textBookManagement.new')}
          </Button>
        </Grid>
      </Grid>

      {!isLoading && (
        <Box mt={4}>
          <Table
            result={textbooks}
            columns={textBookListColumns}
            pageSize={query.pageSize}
            pageIndex={query.pageNumber - 1}
            defaultSorted={query.sortCriteria}
            onManualLoadingTableData={(request: ITableRequest) => {
              const { pageIndex, pageSize, sortCriteria } = request;

              dispatch({
                type: 'textBookList.updateFilter',
                payload: {
                  ...query,
                  searchKey: query.searchKey,
                  pageNumber: pageIndex + 1,
                  pageSize,
                  sortCriteria
                }
              });
            }}
            getTrProps={getTrProps}
          />
        </Box>
      )}
    </AdminPageLayout>
  );
};

export default TextBookListContainer;
