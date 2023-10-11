import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface IProps extends React.PropsWithChildren {
  title: string;
  id: string;
}

const AdminPageLayout = ({ title, children, id = '' }: IProps) => {
  const theme = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Box
      data-id={id}
      sx={{
        p: 5
      }}
    >
      <Box
        sx={{
          position: 'relative',
          border: `1px solid ${theme.palette.borderColor}`,
          borderRadius: 1
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -15,
            left: 15,
            background: `${theme.palette.color?.white}`
          }}
        >
          <Typography variant="h2">{title}</Typography>
        </Box>
        {!isMounted ? (
          <Box
            sx={{
              position: 'absolute',
              width: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ) : (
          <Box
            sx={{
              mt: 2,
              p: 3
            }}
          >
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminPageLayout;
