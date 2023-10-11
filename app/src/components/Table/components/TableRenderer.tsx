import { Box, Table, TableCellProps, TablePagination, TableRowProps } from '@mui/material';
import { Row, Table as TableTypes } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import TableBody from './TableBodyRenderer';
import TableHeaderRenderer from './TableHeaderRenderer';
interface TableRendererProps<TData extends object> {
  table: TableTypes<TData>;
  totalRows: number;
  showPagination: boolean;
  pageSizeOptions: number[];
  getTdProps?: (row: Row<TData>) => TableCellProps;
  getTrProps?: (row: Row<TData>) => TableRowProps;
  hasLoadedOnce: boolean;
}

const TableRenderer = <TData extends object>(props: TableRendererProps<TData>) => {
  const { t } = useTranslation();
  const { table, totalRows, showPagination, pageSizeOptions, getTdProps, getTrProps, hasLoadedOnce } = props;
  const tableState = table.getState();
  const { setPageIndex, setPageSize } = table;
  return (
    <Box>
      <Table>
        <TableHeaderRenderer headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} getTdProps={getTdProps} getTrProps={getTrProps} />
      </Table>
      {hasLoadedOnce && table.getPageCount() > 0 && showPagination ? (
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={totalRows}
          rowsPerPage={tableState.pagination.pageSize || pageSizeOptions[0]}
          page={tableState.pagination.pageIndex}
          onPageChange={(event: unknown, newPage: number) => {
            setPageIndex(newPage);
          }}
          labelRowsPerPage={t('rowsPerPage')}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPageSize(Number(event.target.value));
            setPageIndex(0);
          }}
          showFirstButton
          showLastButton
        />
      ) : null}
    </Box>
  );
};

export default TableRenderer;
