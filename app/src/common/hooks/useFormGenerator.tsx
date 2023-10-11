import { yupResolver } from '@hookform/resolvers/yup';
import _get from 'lodash/get';
import { useEffect } from 'react';
import { FieldValues, Path, UseFormReturn, useForm } from 'react-hook-form';
import { usePrevious } from 'react-use';

interface IGenerationOptions<TFormData> {
  item?: TFormData;
  defaultValues?: any;
  validationSchema: any;
  fieldsToWatch?: string[];
  onWatchFieldsChange?: (
    formInstance: Partial<UseFormReturn<any, any>>,
    fieldName: string,
    newValue: any,
    oldValue: any
  ) => void;
}

type RecursiveSchema = {
  [K: string]: RecursiveSchema | string;
};

const flattenObjectKey = (objectValue: RecursiveSchema, prefix: string = ''): string[] =>
  objectValue
    ? Object.keys(objectValue).reduce((acc: string[], k) => {
        const pre = prefix.length ? prefix + '.' : '';
        const value = objectValue[k];
        if (value && typeof value === 'object') {
          acc.push(...flattenObjectKey(objectValue[k] as RecursiveSchema, pre + k));
        } else {
          acc.push(pre + k);
        }

        return acc;
      }, [])
    : [];

export const useFormGenerator = <TFormData extends FieldValues>(props: IGenerationOptions<TFormData>) => {
  const { item = {}, defaultValues, validationSchema, fieldsToWatch = [], onWatchFieldsChange = () => {} } = props;

  const form = useForm<TFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });
  const { watch } = form;
  const watchFields = watch(fieldsToWatch as Path<TFormData>[]);
  const prevWatchFields = usePrevious(watchFields);

  const prevItem = usePrevious(item as TFormData);

  // This effect is for the value from parent has changed and we need sync it with the form
  // This is just a one-way checking (form value in parent to react-hook-form), not vice versa
  useEffect(() => {
    if (prevItem && item && item !== prevItem) {
      for (const [key, value] of Object.entries(item)) {
        const prevValue = _get(prevItem, key);

        if (value !== prevValue) {
          if (typeof value === 'object') {
            const flattenKeys = flattenObjectKey(value as RecursiveSchema);

            for (let i = 0; i < flattenKeys.length; i++) {
              const fullPath = `${key}.${flattenKeys[i]}`;
              const objectKey = flattenKeys[i];
              const newValue = _get(value, flattenKeys[i]);

              if (newValue !== _get(prevValue, objectKey)) {
                form.setValue(fullPath as Path<TFormData>, newValue as any, {
                  shouldValidate: !!prevItem,
                  shouldDirty: !!prevItem
                });
              }
            }
          } else {
            form.setValue(key as Path<TFormData>, value as any, {
              shouldValidate: !!prevItem,
              shouldDirty: !!prevItem
            });
          }
        }
      }
    }
  }, [form, item, prevItem]);

  // This effect is for invoke callback when watching fields get changed
  useEffect(() => {
    if (prevWatchFields) {
      for (let i = 0; i < fieldsToWatch.length; i++) {
        const fieldName = fieldsToWatch[i];
        const newValue = watchFields[i];
        const oldValue = prevWatchFields[i];

        if (newValue !== oldValue) {
          onWatchFieldsChange(form, fieldName, newValue, oldValue);
        }
      }
    }
  }, [fieldsToWatch, form, onWatchFieldsChange, prevWatchFields, watchFields]);

  return {
    form
  };
};

export default useFormGenerator;
