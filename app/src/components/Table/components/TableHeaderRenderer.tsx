import { SxProps, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { HeaderGroup, flexRender } from '@tanstack/react-table';

interface TableHeaderProps<TData extends object> {
  headerGroups: HeaderGroup<TData>[];
}

const TableHeaderRenderer = <TData extends object>(props: TableHeaderProps<TData>) => {
  const { headerGroups } = props;
  const theme = useTheme();
  const getHeaderGroupProps = () => {
    const sx: SxProps = {
      boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      background: theme.palette.color.white,
      border: `1px solid ${theme.palette.borderColor}`
    };

    return {
      sx
    };
  };

  const getHeaderProps = () => {
    const sx: SxProps = {
      ':first-of-type': {
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px'
      },
      ':last-child': {
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px'
      },
      borderBottom: 'none'
    };

    return {
      sx
    };
  };

  return (
    <TableHead sx={{ position: 'relative' }}>
      {headerGroups.map((headerGroup: HeaderGroup<TData>) => (
        <TableRow {...getHeaderGroupProps()} key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const column = header.column;
            const sortOrder = header.column.getIsSorted();
            return (
              <TableCell {...getHeaderProps()} key={header.id}>
                <Box>
                  {column.getCanSort() ? (
                    <TableSortLabel
                      active={Boolean(sortOrder)}
                      component="div"
                      direction={sortOrder ? sortOrder : undefined}
                      onClick={column.getToggleSortingHandler()}
                    >
                      <>{flexRender(column.columnDef.header, header.getContext())}</>
                    </TableSortLabel>
                  ) : (
                    <>{flexRender(column.columnDef.header, header.getContext())}</>
                  )}
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableHead>
  );
};

export default TableHeaderRenderer;
