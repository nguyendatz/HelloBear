import { yupResolver } from '@hookform/resolvers/yup';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { PushAndListenResponse } from 'apis/nswag';
import useDialog from 'common/hooks/useDialog';
import InputTextField from 'components/Inputs/InputTextField';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { defaultRectangleValue, rectangleValidationSchema } from '../utils';

interface IProps {
  onDialogClose: (response?: object) => void;
  rectangle?: PushAndListenResponse;
}

const RectangleDialog = ({ onDialogClose, rectangle }: IProps) => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const methods = useForm<Pick<PushAndListenResponse, 'name' | 'audioFileUrl'>>({
    resolver: yupResolver(rectangleValidationSchema),
    defaultValues: defaultRectangleValue
  });
  const { control, reset, handleSubmit, formState } = methods;

  const handleCancel = async () => {
    const isDirty = Object.keys(formState.dirtyFields).length > 0;
    if (isDirty) {
      const confirm: any = await dialog.message({
        title: '',
        message: t('common.unsavedChangesAlert')
      });
      if (confirm.success) {
        return onDialogClose();
      }
    } else {
      onDialogClose();
    }
  };
  const handleOk = async (data: Pick<PushAndListenResponse, 'name' | 'audioFileUrl'>) => {
    onDialogClose(data);
  };
  useEffect(() => {
    if (rectangle) {
      reset({
        name: rectangle.name,
        audioFileUrl: rectangle.audioFileUrl
      });
    }
  }, [rectangle, reset]);
  return (
    <Dialog open={true} onClose={handleCancel}>
      <DialogTitle sx={{ fontSize: '1.25rem' }}>{rectangle ? t('pushListen.edit') : t('pushListen.create')}</DialogTitle>
      <DialogContent>
        <Box component="form" id="rectangle-form" noValidate autoComplete="off" mt={2}>
          <Grid container columnSpacing={2} rowSpacing={4}>
            <Grid item xs={12}>
              <InputTextField name="name" control={control} label={'Name'} required />
            </Grid>
            <Grid item xs={12}>
              <InputTextField name="audioFileUrl" control={control} label={'Url Audio File'} required />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={formState.isSubmitting}
          loadingPosition="end"
          variant="contained"
          endIcon={<SaveIcon />}
          onClick={handleSubmit(handleOk)}
        >
          {t('save')}
        </LoadingButton>
        <Button variant="outlined" onClick={handleCancel}>
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RectangleDialog;
