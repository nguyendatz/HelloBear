import AdminPageLayout from 'app/layout/AdminPageLayout';
import { useTranslation } from 'react-i18next';
import ClassListTable from './components/ClassListTable';
const ClassManagementPage = () => {
  const { t } = useTranslation();
  return (
    <AdminPageLayout id="ClassManagement" title={t('classManagement.title')}>
      <ClassListTable />
    </AdminPageLayout>
  );
};

export default ClassManagementPage;
