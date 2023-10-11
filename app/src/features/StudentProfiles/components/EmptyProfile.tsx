import { Box, Typography } from '@mui/material';
import { studentClient } from 'apis';
import { CreateStudentCommand, StudentProfile } from 'apis/nswag';
import { useAppDispatch } from 'app/store';
import useDialog from 'common/hooks/useDialog';
import { showNotification } from 'common/utils/toastNotification';
import { useTranslation } from 'react-i18next';
import { To, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../studentSlice';
import AddProfileDialog from './AddProfileDialog';

const EmptyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const dialog = useDialog();
  const navigate = useNavigate();
  const id = searchParams.get('class');
  const handleCreateProfile = async () => {
    const data = (await dialog.show(AddProfileDialog, {})) as CreateStudentCommand;
    if (data.name) {
      const student = await studentClient.create({ ...data, hashCode: id ?? '' });
      if (student) {
        const currentListProfiles = localStorage.getItem('profiles');
        const newListProfiles = currentListProfiles ? [...JSON.parse(currentListProfiles), student] : [student];
        localStorage.setItem('profiles', JSON.stringify(newListProfiles));
        showNotification({ message: 'Saved', severity: 'success', autoHideDuration: 2000 });
        if (!currentListProfiles) {
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
      }
    }
  };
  return (
    <Box
      sx={{
        p: 8,
        height: '100%',
        backgroundImage: 'url(/images/bg-profiles.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom'
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: {
            xs: 'column-reverse',
            md: 'row'
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            alignSelf: 'flex-end',
            flex: {
              xs: 1
            },
            display: {
              xs: 'flex',
              md: 'block'
            },
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          <Box
            component="img"
            src="/images/branding.png"
            alt="branding"
            draggable="false"
            sx={{
              width: {
                xs: 200,
                md: 420
              }
            }}
          />
        </Box>
        <Box
          sx={{
            flex: {
              xs: 1
            },
            textAlign: {
              xs: 'center',
              md: 'unset'
            },
            placeSelf: 'center'
          }}
        >
          <Box
            component="img"
            src="/images/btn-add-profiles.png"
            alt="button-add-profiles"
            draggable="false"
            sx={{
              cursor: 'pointer',
              width: {
                xs: 120,
                md: 196
              },
              ml: {
                xs: 0,
                md: 3
              }
            }}
            onClick={handleCreateProfile}
          />
          <Typography
            sx={{
              fontSize: {
                xs: '2rem',
                md: '3rem'
              },
              fontWeight: 700
            }}
          >
            {t('profile.addMulti')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EmptyProfile;
