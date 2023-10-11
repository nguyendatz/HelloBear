import { ColumnDef, Row } from '@tanstack/react-table';

export interface PaginatedList<TData> {
  items?: TData[];
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
}

export interface TablePagedResult<TData> extends PaginatedList<TData> {
  pageSize?: number;
}
export interface SortCriteria {
  sortKey?: string;
  isDescending?: boolean;
}

export interface ITableRequest {
  sortCriteria: SortCriteria[];
  pageIndex: number;
  pageSize: number;
}
export interface ITableProps<TData extends object> {
  error?: boolean;
  loading?: boolean;
  result?: TData[] | PaginatedList<TData> | undefined | null;
  columns: ColumnDef<TData, any>[];
  showPagination?: boolean;
  onManualLoadingTableData?: (request: ITableRequest) => void;
  onLoadingChange?: (isLoading?: boolean) => void;
  onPageChange?: (pageIndex?: number) => void;
  triggerProps?: Record<string, any>;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;
  defaultSorted?: SortCriteria[];
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  hiddenColumns?: string[];
  disableLoadingIndicator?: boolean;
  getTdProps?: (row: Row<TData>) => object;
  getTrProps?: (row: Row<TData>) => object;
}
