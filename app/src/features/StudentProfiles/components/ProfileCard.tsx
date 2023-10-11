import { Box, Typography } from '@mui/material';
import { studentClient } from 'apis';
import { CreateStudentCommand, StudentProfile } from 'apis/nswag';
import { useAppDispatch } from 'app/store';
import useDialog from 'common/hooks/useDialog';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { To, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../studentSlice';
import AddProfileDialog from './AddProfileDialog';
import ButtonCancel from './ButtonCancel';

interface IProps {
  student?: StudentProfile;
  isRemoveMode?: boolean;
  isEmpty?: boolean;
  onTrigger: Dispatch<SetStateAction<number>>;
}

const ProfileCard = ({ student, isRemoveMode = false, isEmpty = false, onTrigger }: IProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('class');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const storeProfiles = localStorage.getItem('profiles');
  const currentListProfiles = (storeProfiles ? JSON.parse(storeProfiles) : []) as StudentProfile[];
  const handleRemove = async () => {
    if (isEmpty || !student) {
      return;
    }
    const confirm: any = await dialog.message({
      title: '',
      message: `${t('profile.alertDelete')} ${student.name}`
    });
    if (confirm.success) {
      const newListProfiles = currentListProfiles.filter((profile) => profile.id !== student.id);
      if (newListProfiles.length !== 0) {
        localStorage.setItem('profiles', JSON.stringify(newListProfiles));
      } else {
        localStorage.removeItem('profiles');
      }
      onTrigger(new Date().getTime());
    }
  };
  const handleAddProfile = async () => {
    if (!isEmpty && student) {
      let redirectUrl: string | number = '';
      const { type = '', isClassCompleted }: { type: string; isClassCompleted: boolean } =
        window.history.state.usr || {};
      switch (type) {
        case 'content':
          redirectUrl = isClassCompleted ? '/student/class-completed' : -1;
          break;
        case 'class':
          redirectUrl = `/student/unit-list?classId=${student.classId}`;
          break;
        default:
          redirectUrl = -1;
          break;
      }
      dispatch(login(student as StudentProfile));
      return navigate(redirectUrl as To);
    }
    const data = (await dialog.show(AddProfileDialog, {})) as CreateStudentCommand;
    if (data.name) {
      const student = await studentClient.create({ ...data, hashCode: id ?? '' });
      if (student) {
        const newListProfiles = currentListProfiles ? [...currentListProfiles, student] : [student];
        localStorage.setItem('profiles', JSON.stringify(newListProfiles));
      }
    }
    onTrigger(new Date().getTime());
  };
  const hasButtonRemove = isRemoveMode && !isEmpty;
  const MAXIMUM_CHARACTERS_NAME = 10;
  const studentName =student ? (student.name || '') : ''
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        position: 'relative',
        p: 2,
        background: isEmpty ? 'transparent' : '#FFF',
        borderRadius: 8,
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <Box
        component="img"
        src={isEmpty ? '/icons/add-new-profile.png' : '/images/bg-profile-1.png'}
        alt="profile-img"
        onClick={handleAddProfile}
      ></Box>
      <Typography variant="h4" mt={2} color={'#1C1939'}>
        {isEmpty ? `${t('profile.add')}` : `${studentName.length > 10 ? `${studentName.slice(0,MAXIMUM_CHARACTERS_NAME)}...` : studentName}`}
      </Typography>
      {hasButtonRemove && (
        <Box
          sx={{
            position: 'absolute',
            top: -5,
            right: -5,
            transform: 'scale(1.5)',
            cursor: 'pointer'
          }}
          onClick={handleRemove}
        >
          <ButtonCancel />
        </Box>
      )}
    </Box>
  );
};

export default ProfileCard;
