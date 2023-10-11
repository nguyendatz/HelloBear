import { textBookClient } from 'apis';
import { TextBookDetailResponse } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import AutoFormContainer from 'components/Form/AutoFormContainer';
import { debounce } from 'lodash';
import { useCallback, useEffect, useReducer } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Resizer from 'react-image-file-resizer';
import { useNavigate, useParams } from 'react-router';
import UnitListContainer from '../UnitManagement/UnitListContainer';
import { initialTextBookDetailState, textBookDetailReducer } from './reducer';
import { defaultTextBookDetail, fieldsToWatch, textBookDetailValidationSchema } from './utils';

export const TextBookDetailContainer = () => {
  const { id } = useParams();
  const parsedId = Number(id ?? 0);
  const isEdit = Boolean(parsedId);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialog();
  const [state, dispatch] = useReducer(textBookDetailReducer, initialTextBookDetailState(isEdit));
  const { itemDetail, fieldGroups, isLoading, isSaving, isDirty } = state;

  useEffect(() => {
    const getData = async () => {
      try {
        if (parsedId) {
          dispatch({ type: 'textBookDetail.request' });
          const textBook = await textBookClient.getTextbookDetail(parsedId);
          dispatch({ type: 'textBookDetail.loaded', payload: textBook });
        }
      } catch (err: any) {
        dispatch({ type: 'textBookDetail.error', payload: err });
      }
    };

    getData();
  }, [parsedId, dispatch]);

  const onSubmit: SubmitHandler<TextBookDetailResponse> = async (values) => {
    dispatch({ type: 'textBookDetail.isSaving', payload: true });

    try {
      await textBookClient.save({
        id: parsedId,
        name: values.name ?? '',
        shortName: values.shortName ?? '',
        description: values.description,
        thumbnail: values.thumbnail
      });
      showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
      navigate('/textbooks');
    } catch (err: any) {
      dispatch({ type: 'textBookDetail.error', payload: err });
    }
    dispatch({ type: 'textBookDetail.isSaving', payload: false });
  };
  const onError = (errors: any, e: any) => console.log('', errors, e);

  const handleWatchFieldsChange = useCallback(
    async (form: Partial<UseFormReturn<any, any>>, fieldName: string, newValue: any, oldValue: any) => {
      const { getValues, setValue } = form;
      if (!getValues || !setValue || newValue === oldValue) {
        return;
      }

      if (fieldName === 'thumbnailFile') {
        try {
          await textBookDetailValidationSchema.validateAt(fieldName, getValues());
          const resizedImage = await resizeImage(newValue);
          const filePath = await textBookClient.uploadThumbnail({ data: resizedImage, fileName: resizedImage.name });
          setValue('thumbnail', filePath);
        } catch (ex) {
          setValue('thumbnail', null);
        }
      }

      debounce(() => {
        dispatch({
          type: 'textBookDetail.watchingFieldsChanged',
          payload: getValues()
        });
      }, 200)();
    },
    [dispatch]
  );

  const resizeImage = (imageFile: File) => {
    return new Promise<File>((resolve, reject) => {
      try {
        Resizer.imageFileResizer(
          imageFile,
          300,
          300,
          'JPEG',
          100,
          0,
          (file) => resolve(file as File),
          'file',
          300,
          300
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  return (
    <AdminPageLayout id="TextBookDetail" title={isEdit ? t('textBook.textBookDetail') : t('textBook.createTextBook')}>
      {itemDetail && (
        <AutoFormContainer
          fieldGroups={fieldGroups}
          validationSchema={textBookDetailValidationSchema}
          onSubmit={onSubmit}
          onError={onError}
          item={itemDetail}
          loading={isLoading}
          onCancel={async () => {
            if (isDirty) {
              const res: any = await dialog.message({
                title: '',
                message: t('common.unsavedChangesAlert')
              });
              if (res.success) {
                navigate('/textbooks');
              }
            } else {
              navigate('/textbooks');
            }
          }}
          fieldsToWatch={fieldsToWatch}
          onWatchFieldsChange={handleWatchFieldsChange}
          defaultValues={defaultTextBookDetail}
          isSaving={isSaving}
          translationPrefix="textBook"
        />
      )}
      {parsedId !== 0 && <UnitListContainer textBookId={parsedId} />}
    </AdminPageLayout>
  );
};

export default TextBookDetailContainer;
