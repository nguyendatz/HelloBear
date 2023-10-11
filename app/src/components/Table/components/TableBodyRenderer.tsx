import { TableBody, TableCell, TableCellProps, TableRow, TableRowProps } from '@mui/material';
import { Row, flexRender } from '@tanstack/react-table';

interface TableBodyProps<TData extends object> {
  rows: Row<TData>[];
  getTdProps?: (row: Row<TData>) => TableCellProps;
  getTrProps?: (row: Row<TData>) => TableRowProps;
}

const TableBodyRenderer = <TData extends object>({ rows, getTdProps, getTrProps }: TableBodyProps<TData>) => {
  return (
    <TableBody>
      {(rows ?? []).map((row) => {
        const trProps = getTrProps ? getTrProps(row) : {};
        return (
          <TableRow
            {...trProps}
            key={row.id}
            sx={{
              ...(trProps?.sx || {}),
              cursor: Object.keys(trProps).includes('onClick') ? 'pointer' : ''
            }}
          >
            {row.getVisibleCells().map((cell) => {
              const tdProps = getTdProps ? getTdProps(row) : {};
              return (
                <TableCell className="tbCell" key={`${row.id}-${cell.id}`} {...tdProps}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default TableBodyRenderer;
