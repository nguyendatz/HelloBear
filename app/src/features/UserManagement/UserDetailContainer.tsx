import { userClient } from 'apis';
import { UserDetailResponse } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import AutoFormContainer from 'components/Form/AutoFormContainer';
import { debounce } from 'lodash';
import { useCallback, useEffect, useReducer } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { initialUserDetailState, userDetailReducer } from './reducer';
import { defaultUserDetail, fieldsToWatch, userDetailValidationSchema } from './utils';

export const UserDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dialog = useDialog();
  const isEdit = Boolean(id);
  const [state, dispatch] = useReducer(userDetailReducer(isEdit), initialUserDetailState);
  const { itemDetail, fieldGroups, isLoading, isSaving, isDirty } = state;

  useEffect(() => {
    const getData = async () => {
      try {
        if (id) {
          dispatch({ type: 'userDetail.request', payload: true });
          const user = await userClient.getUserDetail(id);
          dispatch({
            type: 'userDetail.loaded',
            payload: {
              ...user,
              phoneNumber: user.phoneNumber ? user.phoneNumber.replaceAll('-', '') : ''
            }
          });
        }

        const roles = await userClient.getRoles();
        dispatch({ type: 'userDetail.rolesLoaded', payload: roles });
      } catch (err: any) {
        dispatch({ type: 'userDetail.error', payload: err });
      }
    };

    getData();
  }, [id, dispatch]);

  const onSubmit: SubmitHandler<UserDetailResponse> = async (values) => {
    dispatch({ type: 'userDetail.isSaving', payload: true });

    try {
      if (id) {
        await userClient.update(id, {
          ...values,
          phoneNumber: values.phoneNumber ? values.phoneNumber.replaceAll('-', '') : undefined
        });
      } else {
        await userClient.create({
          email: values.email ?? '',
          firstName: values.firstName ?? '',
          lastName: values.lastName ?? '',
          roleId: values.roleId ?? '',
          phoneNumber: values.phoneNumber ? values.phoneNumber.replaceAll('-', '') : undefined
        });
      }
      showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
      navigate('/users');
    } catch (err: any) {
      dispatch({ type: 'userDetail.error', payload: err });
    }

    dispatch({ type: 'userDetail.isSaving', payload: false });
  };
  const onError = (errors: any, e: any) => console.log('', errors, e);

  const handleWatchFieldsChange = useCallback(
    (form: Partial<UseFormReturn<any, any>>, fieldName: string, newValue: any, oldValue: any) => {
      const { getValues } = form;
      if (!getValues || newValue === oldValue) {
        return;
      }

      if (fieldName === 'phoneType') {
        dispatch({
          type: 'userDetail.phoneTypeChanged',
          payload: newValue
        });
      }

      debounce(() => {
        dispatch({
          type: 'userDetail.watchingFieldsChanged',
          payload: getValues()
        });
      }, 200)();
    },
    [dispatch]
  );

  return (
    <AdminPageLayout id="UserDetail" title={isEdit ? t('user.userDetail') : t('user.createUser')}>
      {itemDetail && (
        <AutoFormContainer
          fieldGroups={fieldGroups}
          validationSchema={userDetailValidationSchema}
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
                navigate('/users');
              }
            } else {
              navigate('/users');
            }
          }}
          fieldsToWatch={fieldsToWatch}
          onWatchFieldsChange={handleWatchFieldsChange}
          defaultValues={defaultUserDetail}
          isSaving={isSaving}
          translationPrefix="user"
        />
      )}
    </AdminPageLayout>
  );
};

export default UserDetail;
