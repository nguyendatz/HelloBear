import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import useFormGenerator from 'common/hooks/useFormGenerator';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IFieldGroupTemplate } from 'types/FormGenerator';
import { FormGenerator } from './FormGenerator';

interface IProps {
  fieldGroups: IFieldGroupTemplate[];
  item?: any;
  defaultValues?: any;
  validationSchema: any;
  saveIcon?: any;
  onSubmit?: (data: any) => void;
  onError: (errors: any, e: any) => void;
  onCancel?: () => void;
  submitButonLabel?: string | React.ReactNode;
  loading?: boolean;
  fieldsToWatch?: string[];
  onWatchFieldsChange?: (
    formInstance: Partial<UseFormReturn<any, any>>,
    fieldName: string,
    newValue: any,
    oldValue: any
  ) => void;
  canSave?: boolean;
  isSaving?: boolean;
  formRef?: React.MutableRefObject<UseFormReturn<any, any> | null>;
  translationPrefix: string;
}

export const AutoFormContainer = (props: IProps) => {
  const {
    fieldGroups,
    item = {},
    defaultValues,
    validationSchema,
    onSubmit,
    onError,
    onCancel,
    submitButonLabel,
    loading,
    fieldsToWatch = [],
    onWatchFieldsChange = () => {},
    canSave = true,
    isSaving = false,
    formRef = null,
    saveIcon = null,
    translationPrefix
  } = props;

  const { form } = useFormGenerator({
    item,
    validationSchema,
    fieldsToWatch,
    onWatchFieldsChange,
    defaultValues: defaultValues ?? item
  });

  React.useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
  }, [form, formRef]);

  const { handleSubmit, ...formInstance } = form;

  const { t } = useTranslation();

  return (
    <FormControl fullWidth>
      <FormGenerator
        fieldGroups={fieldGroups}
        formInstance={formInstance}
        readOnly={!canSave}
        translationPrefix={translationPrefix}
      />
      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
        {!!onSubmit && (
          <LoadingButton
            disabled={!canSave || loading}
            loading={isSaving}
            loadingPosition="end"
            variant="contained"
            endIcon={saveIcon || <SaveIcon />}
            onClick={handleSubmit(onSubmit, onError)}
          >
            {submitButonLabel ?? t('Save')}
          </LoadingButton>
        )}
        {!!onCancel && (
          <LoadingButton disabled={loading ?? isSaving} variant="outlined" onClick={onCancel}>
            {t('Cancel')}
          </LoadingButton>
        )}
      </Stack>
    </FormControl>
  );
};

export default AutoFormContainer;
