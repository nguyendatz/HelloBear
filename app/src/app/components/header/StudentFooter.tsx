import { Box } from '@mui/material';

export default function StudentFooter() {
  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        height: {
          xs: 208,
          sm: 229
        },
        backgroundImage: {
          xs: 'url(/images/footer-xs.png)',
          sm: 'url(/images/footer.png)'
        },
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left'
      }}
    ></Box>
  );
}
