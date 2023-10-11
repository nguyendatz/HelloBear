import { SortingState, TableState } from '@tanstack/react-table';
import { SortCriteria } from 'apis/nswag';
import { ITableRequest, PaginatedList, TablePagedResult } from './types';

// Request has PageIndex property which is start from 0
export const getPagingOptionsFromState = (state: Partial<TableState>): ITableRequest => {
  const { sorting, pagination } = state;
  const sortCriteria = sorting
    ? sorting.map((column) => ({
        sortKey: column.id,
        isDescending: column.desc
      }))
    : [];

  return {
    sortCriteria,
    pageIndex: pagination?.pageIndex ?? 0,
    pageSize: pagination?.pageSize ?? 0
  };
};

// Result has PageNumber property which is start from 1
export const getStateFromPagedResult = <TData>(
  result: TData[] | PaginatedList<TData> | undefined | null,
  pageSize: number
): TablePagedResult<TData> => {
  if (!result) {
    return {
      pageSize,
      pageNumber: 0,
      totalPages: -1,
      totalCount: 0,
      items: []
    };
  }

  // If this is not a paged result, but is an array, do this...
  if (Array.isArray(result)) {
    return {
      pageNumber: 0,
      totalPages: -1,
      totalCount: result.length,
      items: result
    };
  }

  return {
    pageSize,
    pageNumber: result.pageNumber,
    totalPages: result.totalPages,
    totalCount: result.totalCount,
    items: result.items || []
  };
};

export const getTableSorting = (sortCriteria: SortCriteria[]): SortingState => {
  const sorting: SortingState = sortCriteria.map((sort) => ({
    id: sort.sortKey ?? '',
    desc: Boolean(sort.isDescending)
  }));

  return sorting;
};

export const buildVisibilityColumns = (hiddenColumns: string[]) =>
  hiddenColumns.reduce((prevValue: Record<string, boolean>, currentValue) => {
    prevValue[currentValue] = false;

    return prevValue;
  }, {});
