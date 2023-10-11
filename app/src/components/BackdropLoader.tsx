import { SxProps, Theme } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export interface IProps {
  isOpen?: boolean;
  sx?: SxProps<Theme>;
}

export const BackdropLoader = ({ isOpen, sx }: IProps) => {
  return (
    <Backdrop sx={{ color: '#76ff03', zIndex: (theme) => theme.zIndex.drawer + 1, ...sx }} open={isOpen ?? false}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoader;
