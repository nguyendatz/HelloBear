import { Row } from '@tanstack/react-table';

export const getTrProps =
  (handleClickRow: (original: { [key: string]: number | string }) => void) => (row: Row<any>) => {
    return {
      hover: true,
      sx: {
        '&:hover': {
          cursor: 'pointer'
        }
      },
      onClick: handleClickRow(row.original)
    };
  };
