/* eslint-disable react/prop-types */
import { Divider, Typography } from '@mui/material';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import ContentList from './components/ContentList';
import UnitInformation from './components/UnitInformation';

const UnitDetailContainer = () => {
  const { t } = useTranslation();
  const { unitId, textBookId } = useParams();
  const isEdit = Boolean(unitId);

  return (
    <AdminPageLayout id="ContentList" title={''}>
      <Typography variant="h1" mb={3}>
        {isEdit ? t('unit.unitDetail') : t('unit.create')}
      </Typography>

      <UnitInformation unitId={Number(unitId)} isEdit={isEdit} textBookId={Number(textBookId)} />

      <Divider sx={{ my: 2 }} />

      {isEdit && (
        <>
          <Typography variant="h1" mt={3}>
            {t('content.list')}
          </Typography>
          <ContentList unitId={Number(unitId)} />
        </>
      )}
    </AdminPageLayout>
  );
};

export default UnitDetailContainer;
