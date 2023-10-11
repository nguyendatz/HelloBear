/* eslint-disable react/prop-types */
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, MenuItem } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { authClient, userClient } from 'apis';
import { UserListResponse, UserStatus } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
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
import { format, parseISO } from 'date-fns';
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { initialUserListQuery, initialUserListState, userListReducer } from './reducer';

const UserList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryFromSearchParams = useInitialQueryFromSearchParams(initialUserListQuery);
  const [state, dispatch] = useReducer(userListReducer, {
    ...initialUserListState,
    query: queryFromSearchParams
  });
  const { userList, query, isLoading, isSaving } = state;
  useSearchParamsWithQuery(query);

  const dialog = useDialog();
  const [searchText, setSearchText] = useState(query.searchKey);
  useDebounce(
    () => {
      if (query.searchKey !== searchText) {
        dispatch({ type: 'userList.updateFilter', payload: { ...query, pageNumber: 1, searchKey: searchText } });
      }
    },
    300,
    [searchText]
  );
  const loadData = useCallback(
    async (cancelToken?: CancelToken) => {
      try {
        dispatch({ type: 'userList.request' });
        const res = await userClient.getUsersWithPagination(
          undefined,
          query.searchKey,
          query.pageNumber,
          query.pageSize,
          query.sortCriteria,
          cancelToken
        );
        dispatch({ type: 'userList.loaded', payload: res });
      } catch (err: any) {
        dispatch({ type: 'userList.error', payload: err });
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

  const handleResetPassword = useCallback(
    async (email?: string | null) => {
      dispatch({ type: 'userList.isSaving', payload: true });

      try {
        await authClient.forgotPassword({ email: email ?? '' });
        showNotification({ message: t('user.sent'), severity: 'success', autoHideDuration: 2000 });
      } catch (err: any) {
        dispatch({ type: 'userList.error', payload: err });
      }

      dispatch({ type: 'userList.isSaving', payload: false });
    },
    [t]
  );

  const handleResendInvitation = useCallback(
    async (id?: string | null) => {
      dispatch({ type: 'userList.isSaving', payload: true });

      try {
        await userClient.sendInvitation(id ?? '');
        showNotification({ message: t('user.sent'), severity: 'success', autoHideDuration: 2000 });
      } catch (err: any) {
        dispatch({ type: 'userList.error', payload: err });
      }

      dispatch({ type: 'userList.isSaving', payload: false });
    },
    [t]
  );
  const handleDeleteUser = useCallback(
    async (original: UserListResponse) => {
      const { id } = original;
      dispatch({ type: 'userList.isSaving', payload: true });

      try {
        await userClient.delete(id ?? '');
        dispatch({
          type: 'userList.updateFilter',
          payload: { ...query }
        });
      } catch (err: any) {
        dispatch({ type: 'userList.error', payload: err });
      }

      dispatch({ type: 'userList.isSaving', payload: false });
    },
    [query]
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

  const columnHelper = createColumnHelper<UserListResponse>();

  const userListColumns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: t('user.firstName')
      }),
      columnHelper.accessor('lastName', {
        header: t('user.lastName')
      }),
      columnHelper.accessor('roles', {
        header: t('user.role'),
        enableSorting: false,
        cell: (props) => props.getValue()?.join(', ') ?? ''
      }),
      columnHelper.accessor('dateCreated', {
        header: t('user.dateCreated'),
        cell: (props) => {
          const { getValue } = props;
          const dateCreated = getValue();
          return dateCreated ? format(parseISO(dateCreated), 'MM/dd/yyyy') : '';
        }
      }),
      columnHelper.display({
        id: 'actions',
        cell: (props) => {
          const { original } = props.row;

          return (
            <ThreeDotsMenu>
              {original.status === UserStatus.Invited && (
                <MenuItem
                  onClick={() =>
                    confirmDialog(t('user.resendInvitationAlert'), () => handleResendInvitation(original.id))
                  }
                >
                  {t('user.resendInvitation')}
                </MenuItem>
              )}
              {original.status === UserStatus.Actived && (
                <MenuItem
                  onClick={() =>
                    confirmDialog(t('user.resetPasswordAlert'), () => handleResetPassword(original.email ?? ''))
                  }
                >
                  {t('user.resetPassword')}
                </MenuItem>
              )}
              <MenuItem
                onClick={() =>
                  confirmDialog(formatStr(t('user.deleteAlert'), original.fullName ?? ''), () =>
                    handleDeleteUser(original)
                  )
                }
              >
                {t('user.delete')}
              </MenuItem>
            </ThreeDotsMenu>
          );
        }
      })
    ],
    [columnHelper, handleDeleteUser, handleResendInvitation, handleResetPassword, t, confirmDialog]
  );

  return (
    <AdminPageLayout id="UserList" title={t('user.userList')}>
      {isSaving && <BackdropLoader isOpen={isSaving} />}
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={3}>
          <SearchTextField value={searchText} placeholder={t('search')} onChange={onChangeSearchKey} fullWidth />
        </Grid>
        <Grid item xs={12} sm={9} sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/users/new')}
            disabled={isLoading}
          >
            {t('user.newUser')}
          </Button>
        </Grid>
      </Grid>

      {!isLoading && (
        <Grid container direction="row" mt={4}>
          <Grid item xs={12}>
            <Table
              columns={userListColumns}
              pageIndex={query.pageNumber - 1}
              pageSize={query.pageSize}
              result={userList}
              onManualLoadingTableData={({ pageIndex, pageSize, sortCriteria }) => {
                dispatch({
                  type: 'userList.updateFilter',
                  payload: {
                    ...query,
                    searchKey: query.searchKey,
                    pageNumber: pageIndex + 1,
                    pageSize,
                    sortCriteria
                  }
                });
              }}
              getTrProps={getTrProps((original: any) => () => navigate(`/users/${original.id}`))}
              loading={isLoading}
              defaultSorted={query.sortCriteria}
            />
          </Grid>
        </Grid>
      )}
    </AdminPageLayout>
  );
};

export default UserList;
