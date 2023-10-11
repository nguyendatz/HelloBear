import { Box, TableContainer } from '@mui/material';
import {
  Table as ReactTable,
  TableState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'common/consts/table';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFirstMountState, usePrevious } from 'react-use';
import TableRenderer from './components/TableRenderer';
import { ITableProps, ITableRequest, PaginatedList, TablePagedResult } from './types';
import { buildVisibilityColumns, getPagingOptionsFromState, getStateFromPagedResult, getTableSorting } from './utils';

const Table = <TData extends object>(props: ITableProps<TData>) => {
  const {
    result,
    columns,
    defaultSorted,
    error: outerError,
    loading: outerLoading,
    showPagination = true,
    pageSize: outerPageSize = PAGE_SIZE,
    pageIndex: outerPageIndex = 0,
    onManualLoadingTableData,
    onLoadingChange = () => {},
    onPageChange = () => {},
    enableSorting = true,
    enableMultiSort = true,
    getTrProps,
    getTdProps,
    hiddenColumns = [],
    disableLoadingIndicator = false
  } = props;
  const didMount = useRef(false);
  const firstMount = useFirstMountState();
  const [innerLoading, setInnerLoading] = useState<boolean>(false);
  const [innerError, setInnerError] = useState(null);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    buildVisibilityColumns(hiddenColumns)
  );

  const prevResult = usePrevious(result);

  const manual = Boolean(onManualLoadingTableData);
  const resultState: TablePagedResult<TData> = useMemo(
    () =>
      manual
        ? getStateFromPagedResult(result, outerPageSize)
        : {
            pageNumber: outerPageIndex,
            totalPages: (() => {
              const _resultCount = (result as Array<TData>)?.length ?? 0;
              if (!_resultCount) {
                return -1;
              }

              return _resultCount === 0 ? 1 : Math.ceil(_resultCount / outerPageSize);
            })(),
            pageSize: outerPageSize,
            totalCount: (result as Array<TData>)?.length ?? 0,
            items: (result ?? []) as TData[]
          },
    [result, outerPageIndex, outerPageSize, manual]
  );
  // https://tanstack.com/table/v8/docs/api/core/table#options
  const table: ReactTable<TData> = useReactTable<TData>({
    data: resultState.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel<TData>(),
    initialState: {
      sorting: getTableSorting(defaultSorted ?? []),
      pagination: {
        pageSize: outerPageSize,
        pageIndex: outerPageIndex
      },
      columnVisibility
    },
    // https://tanstack.com/table/v8/docs/api/features/pagination
    manualPagination: manual,
    // If only doing manual pagination, you don't need this
    getPaginationRowModel: manual ? undefined : getPaginationRowModel<TData>(),
    pageCount: resultState.totalPages,
    // https://tanstack.com/table/v8/docs/api/features/sorting
    manualSorting: manual,
    getSortedRowModel: getSortedRowModel<TData>(),
    enableSorting,
    enableMultiSort,
    enableSortingRemoval: false,
    // https://tanstack.com/table/v8/docs/api/features/column-visibility
    onColumnVisibilityChange: setColumnVisibility
  });

  // https://tanstack.com/table/v8/docs/api/core/table#getstate
  // Recommend to use this for processing data
  const tableState = table.getState();

  const {
    pagination: { pageIndex: internalPageIndex, pageSize: internalPageSize },
    sorting: internalSorting
  } = tableState;
  // https://tanstack.com/table/v8/docs/api/features/sorting#setsorting
  // https://tanstack.com/table/v8/docs/api/features/pagination#setpageindex
  // https://tanstack.com/table/v8/docs/api/features/pagination#setpagesize
  const { setPageIndex, getPageCount } = table;
  const internalPageCount = getPageCount();
  const prevTableState = usePrevious(tableState);
  const prevInternalPageCount = usePrevious(internalPageCount);

  const handleLoading = useCallback(
    (value: boolean) => {
      setInnerLoading(value);
      onLoadingChange(value);
    },
    [onLoadingChange]
  );

  const handleOnLoad = useCallback(
    async (tableStateRequest: Partial<TableState>) => {
      if (!onManualLoadingTableData || firstMount) {
        return;
      }

      handleLoading(true);
      const request: ITableRequest = getPagingOptionsFromState(tableStateRequest);
      const { pageIndex } = request;

      try {
        // In case of we need callback to parent for updating the pageNumber so that it will be sync with the internal table
        if (pageIndex !== outerPageIndex) {
          onPageChange(pageIndex);
        }

        await onManualLoadingTableData(request);

        setInnerError(null);
      } catch (err: any) {
        setInnerError(err);
      } finally {
        handleLoading(false);
      }
    },
    [onPageChange, handleLoading, outerPageIndex, onManualLoadingTableData, firstMount]
  );

  useEffect(() => {
    if (!manual || !didMount.current) {
      return;
    }

    const prevPagination = prevTableState?.pagination;
    const prevSorting = prevTableState?.sorting;

    if (
      prevPagination?.pageIndex !== internalPageIndex ||
      prevPagination?.pageSize !== internalPageSize ||
      !isEqual(prevSorting, internalSorting)
    ) {
      const pageIndex = internalPageIndex < 0 ? 0 : internalPageIndex;
      const tableState = {
        pagination: {
          pageIndex,
          pageSize: internalPageSize
        },
        sorting: internalSorting
      };

      handleOnLoad(tableState);
    }
  }, [
    handleOnLoad,
    internalPageIndex,
    internalPageSize,
    internalSorting,
    manual,
    prevTableState?.pagination,
    prevTableState?.pagination.pageIndex,
    prevTableState?.pagination.pageSize,
    prevTableState?.sorting
  ]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    }
  }, []);

  // This is used for validation of paging values, if false we'll adjust to the nearest pageIndex
  useEffect(() => {
    if (!result || !internalPageCount || Array.isArray(result)) {
      return;
    }

    // In case of page index is greater than total pages, we'll adjust to the last page
    if (internalPageIndex > internalPageCount) {
      setPageIndex(internalPageCount - 2);
    } else if (prevResult) {
      const prevQueryResult = prevResult as PaginatedList<TData>;

      const { totalCount: currentTotalCount = 0, pageNumber: currentPageNumber = 0 } = result;
      const { totalCount: prevTotalCount = 0 } = prevQueryResult;

      // In case of current page has no data, we'll adjust to previous of the current (e.g. Deleting the last item in a page)
      if (currentTotalCount < prevTotalCount && internalPageCount < (prevInternalPageCount ?? -1)) {
        let nextPageIndex = currentPageNumber - 2;
        nextPageIndex = nextPageIndex < 0 ? 0 : nextPageIndex;

        setPageIndex(nextPageIndex);
      }
    }
  }, [result, setPageIndex, prevInternalPageCount, internalPageIndex, internalPageCount, prevResult]);

  useEffect(() => {
    const currentHiddenColumns = Object.keys(columnVisibility);
    const hasUpdate = !isEqual(hiddenColumns, currentHiddenColumns);

    if (hasUpdate) {
      const newVisibilityColumns = buildVisibilityColumns(hiddenColumns);
      setColumnVisibility(newVisibilityColumns);
    }
  }, [columnVisibility, hiddenColumns]);

  // TODO: temporary comment this effect to make it work with paging stuff, but need to revisit and double check for further use cases
  // useEffect(() => {
  //   if (!manual || firstMount) {
  //     return;
  //   }

  //   console.log({ outerPageIndex, outerPageSize });
  //   setPageIndex(outerPageIndex);
  //   setPageSize(outerPageSize);
  //   setSorting(getTableSorting(defaultSorted ?? []));
  // }, [defaultSorted, firstMount, manual, outerPageIndex, outerPageSize, setPageIndex, setPageSize, setSorting]);

  const hasLoadedOnce = manual ? (result as PaginatedList<TData>)?.items !== undefined : result !== undefined;
  const error = outerError || innerError;
  const isLoading = disableLoadingIndicator === false && (innerLoading || outerLoading);
  return (
    <TableContainer>
      {!isLoading && error ? (
        <Box component="span">An error occurred</Box>
      ) : (
        <TableRenderer
          getTdProps={getTdProps}
          getTrProps={getTrProps}
          hasLoadedOnce={hasLoadedOnce}
          showPagination={showPagination}
          table={table}
          totalRows={resultState.totalCount ?? 0}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      )}
    </TableContainer>
  );
};

export default Table;
