import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import { CoreRow, createColumnHelper } from '@tanstack/react-table';
import { classClient, userClient } from 'apis';
import { ClassResponse, ClassStatus } from 'apis/nswag';
import { useAppContext } from 'app/AppContext';
import { ADMIN_APP_ROUTES } from 'app/AppRoutes';
import axios, { CancelToken } from 'axios';
import { defaultDebounceTime } from 'common/consts/configs';
import { MONTH_YEAR_FORMAT } from 'common/consts/date';
import { Roles } from 'common/consts/roles';
import useInitialQueryFromSearchParams from 'common/hooks/useInitialQueryFromSearchParams';
import useSearchParamsWithQuery from 'common/hooks/useSearchParamsWithQuery';
import SearchTextField from 'components/Filters/SearchTextField';
import SelectFilterField from 'components/Filters/SelectFilterField';
import Table from 'components/Table';
import { ITableRequest } from 'components/Table/types';
import { format } from 'date-fns';
import { useAccessControl } from 'features/auth/access-control';
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useDebounce } from 'react-use';
import { classListReducer, initialClassListState, initialClassQuery } from '../class-reducer';
import { ClassListQuery } from '../types';
import { ClassStatusEnumLabels, ClassStatusOptions, buildSortCriteria } from '../utils';

const ClassListTable = () => {
  const {
    state: {
      auth: { info }
    }
  } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isPermitted: isWritable } = useAccessControl({ defaultAllowedRoles: [Roles.Administrator] });
  const queryFromSearchParams = useInitialQueryFromSearchParams(initialClassQuery);
  const [{ query, classes, isLoading, teacherOptions }, dispatch] = useReducer(classListReducer, {
    ...initialClassListState,
    query: queryFromSearchParams
  });
  useSearchParamsWithQuery(query);

  const [searchText, setSearchText] = useState(query.searchKey);

  useDebounce(
    () => {
      if (query.searchKey !== searchText) {
        dispatch({ type: 'classList.updateFilter', payload: { ...query, pageNumber: 1, searchKey: searchText } });
      }
    },
    defaultDebounceTime,
    [searchText]
  );

  useEffect(() => {
    const loadTeacherOptions = async () => {
      const teachers = await userClient.getAllTeachers();
      dispatch({
        type: 'classList.loadTeacherOptions',
        payload: teachers
      });
    };
    loadTeacherOptions();
  }, []);

  const columnHelper = createColumnHelper<ClassResponse>();
  const classListColumns = useMemo(
    () => [
      columnHelper.accessor('classCode', {
        header: t('classManagement.classCode'),
        enableSorting: false
      }),
      columnHelper.accessor('className', {
        header: t('classManagement.className')
      }),
      columnHelper.accessor('mainTeacherName', {
        header: t('classManagement.mainTeacher')
      }),
      columnHelper.accessor('secondaryTeachers', {
        header: t('classManagement.secondaryTeachers'),
        enableSorting: false,
        cell: ({ row }) => {
          const originalRow: ClassResponse = row.original;
          return (originalRow.secondaryTeacherNames || []).map((name) => {
            return <div key={name}>{name}</div>;
          });
        }
      }),
      columnHelper.accessor('endDate', {
        header: t('classManagement.schoolYear'),
        cell: ({ row }) => {
          const originalRow: ClassResponse = row.original;
          return format(new Date(originalRow.endDate ?? new Date()), MONTH_YEAR_FORMAT);
        }
      }),
      columnHelper.accessor('textBookName', {
        header: t('classManagement.textbook')
      }),
      columnHelper.accessor('status', {
        header: t('classManagement.status'),
        cell: ({ row }) => {
          const originalRow: ClassResponse = row.original;
          return ClassStatusEnumLabels[originalRow?.status as keyof typeof ClassStatusEnumLabels];
        },
        enableSorting: false
      }),
      columnHelper.accessor('communityLink', {
        header: t('classManagement.classCommunity'),
        cell: () => {
          //TO-DO
          return <LoginIcon />;
        },
        enableSorting: false
      })
    ],
    [t, columnHelper]
  );

  const getTrProps = (row: CoreRow<any>): object => {
    return {
      onClick: () => {
        navigate(`/${ADMIN_APP_ROUTES.ClassManagement.path}/${row.original.id}`);
      }
    };
  };
  const onAddClass = () => {
    navigate('/classes/add');
  };
  const onChangeSearchKey = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const onChangeFilter = (values: string[] | string | null, name: keyof ClassListQuery) => {
    dispatch({ type: 'classList.updateFilter', payload: { ...query, [name]: values } });
  };

  const queryClasses = useCallback(
    async (cancelToken?: CancelToken) => {
      const isTeacher = info?.role === Roles.Teacher;
      const status = query.status as ClassStatus[] | null | undefined;
      if (status && status.length === 0) {
        dispatch({ type: 'classList.loaded', payload: null });
        return;
      }
      dispatch({ type: 'classList.loading' });
      try {
        const queryResponses = await classClient.getClassesWithPagination(
          status,
          isTeacher ? info.id : query.teacherId ?? undefined,
          query.searchKey,
          query.pageNumber,
          query.pageSize,
          buildSortCriteria(query.sortCriteria || []),
          cancelToken
        );
        dispatch({ type: 'classList.loaded', payload: queryResponses });
      } catch (e) {
        dispatch({ type: 'classList.error' });
      }
    },
    [query, info?.id, info?.role]
  );

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    queryClasses(cancelToken.token);

    return () => {
      cancelToken.cancel();
    };
  }, [queryClasses]);

  return (
    <>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={3}>
          <SearchTextField value={searchText} placeholder={t('search')} onChange={onChangeSearchKey} fullWidth />
        </Grid>
        <Grid item xs={12} sm={2}>
          <SelectFilterField
            options={ClassStatusOptions}
            selectedValues={query.status}
            onChange={(values) => onChangeFilter(values, 'status')}
            name={t('classManagement.status')}
            multiple
            objectEnumLabel={ClassStatusEnumLabels}
            selectProps={{
              disabled: isLoading
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          {teacherOptions && (
            <Autocomplete
              options={teacherOptions}
              getOptionLabel={(option) => option.fullName ?? ''}
              renderInput={(params) => <TextField label={t('classManagement.teacher')} {...params} />}
              onChange={(_, option) => onChangeFilter(option?.id ?? null, 'teacherId')}
              defaultValue={teacherOptions.find((x) => x.id === query.teacherId) ?? null}
            />
          )}
        </Grid>
        {isWritable && <Grid item xs={12} sm={5} sx={{ textAlign: 'right' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClass} disabled={isLoading}>
            {t('classManagement.new')}
          </Button>
        </Grid>}
      </Grid>

      {!isLoading && (
        <Box mt={4}>
          <Table
            result={classes}
            columns={classListColumns}
            pageSize={query.pageSize}
            pageIndex={query.pageNumber - 1}
            defaultSorted={query.sortCriteria}
            onManualLoadingTableData={(request: ITableRequest) => {
              const { pageIndex, pageSize, sortCriteria } = request;

              dispatch({
                type: 'classList.updateFilter',
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
    </>
  );
};

export default ClassListTable;
