import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import getObjectValue from 'lodash/get';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { IFieldGroupTemplate, IFormFieldItem, ILayoutFormGroup } from 'types/FormGenerator';

import { useTranslation } from 'react-i18next';
import FormInputSelector from './FormInputSelector';

interface IProps {
  fieldGroups: IFieldGroupTemplate[];
  formInstance: Omit<UseFormReturn<FieldValues>, 'handleSubmit' | 'watch'>;
  readOnly?: boolean;
  translationPrefix: string;
}

export const FormGenerator = (props: IProps) => {
  const { t } = useTranslation();
  const { fieldGroups, formInstance, readOnly, translationPrefix } = props;

  if (!fieldGroups || fieldGroups.length === 0) {
    return null;
  }

  const { control } = formInstance;

  const renderInputs = (fields: IFormFieldItem[], layout: ILayoutFormGroup | undefined) => {
    return fields.map((field: IFormFieldItem) => {
      const {
        id,
        name,
        selfLayout,
        staticField = false,
        dependOn,
        render = ({ formValues }: FieldValues) => (
          <Typography sx={{ p: 1 }}>{getObjectValue(formValues, field.name)}</Typography>
        ),
        ...fieldProps
      } = field;

      const itemLayout = selfLayout ?? layout ?? { xs: 12 };
      const formValues = formInstance.getValues();

      let showInputControl = true;
      if (dependOn) {
        if (typeof dependOn === 'string') {
          showInputControl = getObjectValue(formValues, dependOn as string) === true;
        } else if (typeof dependOn === 'function') {
          showInputControl = dependOn(formValues);
        }
      }

      if (!showInputControl) {
        return null;
      }

      if (staticField) {
        return (
          <Grid key={id || name} item {...itemLayout}>
            {showInputControl && (
              <>
                {t(`${translationPrefix}.${field.label}`)}
                {render({ formValues })}
              </>
            )}
          </Grid>
        );
      }

      return (
        <Grid key={id || name} item {...itemLayout}>
          <FormInputSelector
            field={{ ...fieldProps, id, name, readOnly, label: t(`${translationPrefix}.${field.label}`) }}
            control={control}
            formInstance={formInstance}
          />
        </Grid>
      );
    });
  };

  return (
    <>
      {fieldGroups
        .filter((x) => !x.dependOn || x.dependOn(formInstance.getValues()))
        .map((group: IFieldGroupTemplate, index: number) => {
          const { name: groupName, fields, layout } = group;
          return (
            <Box key={index}>
              {groupName && (
                <Typography my={2} fontWeight={500} variant="h3">
                  {groupName}
                </Typography>
              )}
              <Grid container direction="row" alignItems="center" spacing={2}>
                {renderInputs(fields, layout)}
              </Grid>
            </Box>
          );
        })}
    </>
  );
};

export default FormGenerator;
