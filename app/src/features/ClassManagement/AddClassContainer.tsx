import { classClient } from 'apis';
import { ClassBodyRequest } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ClassForm from './components/ClassForm';

const AddClassContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialog();
  const onCloseCreating = async (isDirty?: boolean) => {
    if (isDirty) {
      const res: any = await dialog.message({
        title: '',
        message: t('classManagement.unsavedChangesAlert')
      });
      if (res.success) {
        showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
        navigate('/classes');
      }
    }
    navigate('/classes');
  };
  const onCreateClass = async (data: ClassBodyRequest) => {
    const classId = await classClient.create({
      bodyRequest: data
    });
    if (classId) {
      navigate(`/classes/${classId}`);
    }
  };
  return (
    <AdminPageLayout id="class-new" title={t('classManagement.create')}>
      <ClassForm onClose={onCloseCreating} onSubmit={onCreateClass} />
    </AdminPageLayout>
  );
};

export default AddClassContainer;
