import { yupResolver } from '@hookform/resolvers/yup';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { unitClient } from 'apis';
import { showNotification } from 'common/utils/toastNotification';
import { useEffect, useReducer } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { UnitInformationResponse, initialUnitInformationState, unitInformationReducer } from '../reducer';
import { defaultUnitInformation, unitInformationValidationSchema } from '../utils';

interface IProps {
  unitId: number;
  textBookId: number;
  isEdit: boolean;
}

export const UnitInformation = ({ unitId, isEdit, textBookId }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(unitInformationReducer, initialUnitInformationState);
  const { itemDetail } = state;

  const onSubmit: SubmitHandler<UnitInformationResponse> = async (values: any) => {
    dispatch({ type: 'unitInformation.isSaving', payload: true });

    try {
      if (isEdit) {
        await unitClient.update(Number(unitId), values);
      } else {
        const res = await unitClient.create({ ...values, textBookId });
        navigate(`/units/${res}`);
      }
      showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
    } catch (err: any) {
      dispatch({ type: 'unitInformation.error', payload: err });
    }

    dispatch({ type: 'unitInformation.isSaving', payload: false });
  };

  const form = useForm({
    resolver: yupResolver(unitInformationValidationSchema),
    defaultValues: defaultUnitInformation
  });

  const { handleSubmit, formState, control, reset } = form;
  const { field: unitNameField, fieldState: unitNameFieldState } = useController({ name: 'name', control });
  const { field: unitNumberField, fieldState: unitNumberFieldState } = useController({
    name: 'number',
    control
  });
  const { field: phonicsField, fieldState: phonicsFieldState } = useController({
    name: 'phonics',
    control
  });
  const { field: descriptionField, fieldState: descriptionFieldState } = useController({
    name: 'description',
    control
  });
  const { field: languageFocusField, fieldState: languageFocusFieldState } = useController({
    name: 'languageFocus',
    control
  });

  const onCancle = () => {
    navigate(`/text-books/${itemDetail?.textBookId || textBookId}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (unitId) {
          dispatch({ type: 'unitInformation.request', payload: true });
          const lesson = await unitClient.getLessonById(Number(unitId));
          dispatch({ type: 'unitInformation.loaded', payload: lesson });
          reset(lesson);
        }
      } catch (err: any) {
        dispatch({ type: 'unitInformation.error', payload: err });
      }
    };

    getData();
  }, [unitId, dispatch, reset]);
  return (
    <Box>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(unitNameFieldState.error)}
            helperText={t(unitNameFieldState.error?.message || '')}
            name={unitNameField.name}
            value={unitNameField.value}
            onChange={unitNameField.onChange}
            inputRef={unitNameField.ref}
            disabled={formState.isSubmitting}
            id="name"
            label={t('unit.name')}
            autoComplete="name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(languageFocusFieldState.error)}
            helperText={t(languageFocusFieldState.error?.message || '')}
            name={languageFocusField.name}
            value={languageFocusField.value}
            onChange={languageFocusField.onChange}
            inputRef={languageFocusField.ref}
            id="languageFocus"
            label={t('unit.languageFocus')}
            autoComplete="languageFocus"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(unitNumberFieldState.error)}
            helperText={t(unitNumberFieldState.error?.message || '')}
            name={unitNumberField.name}
            value={unitNumberField.value}
            onChange={unitNumberField.onChange}
            inputRef={unitNumberField.ref}
            disabled={formState.isSubmitting}
            id="number"
            label={t('unit.number')}
            autoComplete="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(phonicsFieldState.error)}
            helperText={t(phonicsFieldState.error?.message || '')}
            name={phonicsField.name}
            value={phonicsField.value}
            onChange={phonicsField.onChange}
            inputRef={phonicsField.ref}
            disabled={formState.isSubmitting}
            id="phonics"
            label={t('unit.phonics')}
            autoComplete="phonics"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            fullWidth
            error={Boolean(descriptionFieldState.error)}
            helperText={t(descriptionFieldState.error?.message || '')}
            name={descriptionField.name}
            value={descriptionField.value}
            onChange={descriptionField.onChange}
            inputRef={descriptionField.ref}
            disabled={formState.isSubmitting}
            id="description"
            label={t('unit.description')}
            autoComplete="description"
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}
      >
        <Button onClick={onCancle} variant="outlined">
          {t('cancel')}
        </Button>

        <LoadingButton
          loading={formState.isSubmitting}
          loadingPosition="end"
          variant="contained"
          endIcon={<SaveIcon />}
          onClick={handleSubmit(onSubmit)}
        >
          {t('save')}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default UnitInformation;
