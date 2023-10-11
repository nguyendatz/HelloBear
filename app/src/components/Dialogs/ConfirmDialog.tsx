import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

const ConfirmDialog = ({ message, title, onDialogClose, btnLabel, showCancelButton = true }: IProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleOk = () => onDialogClose({ success: true });
  const handleCancel = () => onDialogClose({ success: false });

  return (
    <Dialog open={true} fullScreen={fullScreen} onClose={handleCancel}>
      <DialogTitle sx={{ fontSize: '1.25rem' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleOk}>
          {btnLabel ?? t('common.yes')}
        </Button>
        {showCancelButton && (
          <Button variant="outlined" onClick={handleCancel}>
            {t('common.no')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

interface IProps {
  classes: string;
  message: string;
  title?: string;
  btnLabel?: string;
  onDialogClose: (modalResult: object) => void;
  size?: 'sm' | 'lg' | 'xl';
  showCancelButton: boolean;
}

export default ConfirmDialog;
