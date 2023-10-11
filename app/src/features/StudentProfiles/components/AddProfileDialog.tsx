import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Dialog, DialogTitle } from '@mui/material';
import { CreateStudentCommand } from 'apis/nswag';
import InputTextField from 'components/Inputs/InputTextField';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createStudentValidationSchema, defaultCreateStudentValues } from '../utils';
import ButtonCancel from './ButtonCancel';

interface IProps {
  onDialogClose: (modalResult: object) => void;
}

const AddProfileDialog = ({ onDialogClose }: IProps) => {
  const { t } = useTranslation();
  const handleCancel = () => {
    onDialogClose({});
  };
  const handleOk = async (data: CreateStudentCommand) => {
    onDialogClose(data);
  };

  const methods = useForm<CreateStudentCommand>({
    defaultValues: defaultCreateStudentValues,
    resolver: yupResolver(createStudentValidationSchema)
  });
  const { control, handleSubmit, formState } = methods;
  return (
    <Dialog
      open={true}
      onClose={handleCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 8
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F9EE7D'
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontFamily: 'DotYouris' }}>{t('profile.add')}</DialogTitle>
        <Box
          sx={{
            mr: 2,
            cursor: 'pointer'
          }}
          onClick={handleCancel}
        >
          <ButtonCancel backgroundColor="#4C9D6B" />
        </Box>
      </Box>
      <Box sx={{ background: '#F9EE7D' }}>
        <Box
          sx={{
            background: '#FFF',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            py: 4,
            px: 3
          }}
        >
          <InputTextField name="name" label="Name" placeholder="Enter your name" control={control} fullWidth />
          <Box mt={2} textAlign="center">
            <LoadingButton
              sx={{
                mx: 'auto',
                px: 6,
                py: 2,
                borderRadius: 40,
                boxShadow: '0px 2px 0px 0px #35704C',
                background: 'linear-gradient(101.08deg, #4C9D6B 8.92%, #35B064 93.37%)',
                color: '#FFF'
              }}
              loading={formState.isSubmitting}
              variant="contained"
              onClick={handleSubmit(handleOk)}
            >
              {t('save')}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddProfileDialog;
