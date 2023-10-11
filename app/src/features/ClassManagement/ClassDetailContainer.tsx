import { classClient } from 'apis';
import { ClassBodyRequest, ClassDetailResponse, LessonsByClassResponse } from 'apis/nswag';
import AdminPageLayout from 'app/layout/AdminPageLayout';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import ClassForm from './components/ClassForm';

const ClassDetailContainer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dialog = useDialog();
  const [classInfo, setClassInfo] = useState<ClassDetailResponse & { communityClassList: LessonsByClassResponse[] }>();
  const loadDetailClass = async (classId: number) => {
    const classInfo = await classClient.getClassById(classId);
    const communityClassList = await classClient.getLessonsByClass(Number(classInfo?.id));
    setClassInfo({
      ...classInfo,
      communityClassList
    });
  };
  const onCloseEditing = async (isDirty?: boolean) => {
    if (isDirty) {
      const res: any = await dialog.message({
        title: '',
        message: t('classManagement.unsavedChangesAlert')
      });
      if (res.success) {
        navigate('/classes');
      }
    }
    navigate('/classes');
  };
  const onEditClass = async (data: ClassBodyRequest) => {
    if (!id) return;
    await classClient.update(+id, data);
    showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
    loadDetailClass(+id);
  };
  useEffect(() => {
    let canFetch = true;
    if (canFetch && id) {
      loadDetailClass(+id);
    }
    return () => {
      canFetch = false;
    };
  }, [id]);
  return (
    <AdminPageLayout id="class-detail" title={t('classManagement.detail')}>
      {classInfo && (
        <React.Fragment>
          <ClassForm classInfo={classInfo} onClose={onCloseEditing} onSubmit={onEditClass} />
        </React.Fragment>
      )}
    </AdminPageLayout>
  );
};

export default ClassDetailContainer;
