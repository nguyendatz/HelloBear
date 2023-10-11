import { Box, ThemeProvider, createTheme } from '@mui/material';
import { studentClient } from 'apis';
import { ContentType } from 'apis/nswag';
import { STUDENT_APP_ROUTES } from 'app/AppRoutes';
import { useAppSelector } from 'app/store';
import axios, { CancelToken } from 'axios';
import GlobalDialog from 'components/Dialogs/GlobalDialog';
import GlobalAlert from 'components/GlobalAlert';
import { useCallback, useEffect } from 'react';
import { Outlet } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';
import appThemes from 'styles';
import themeTypography from 'styles/typography';

const StudentLayout = () => {
  const { contentId, classHashCode } = useParams();
  const navigate = useNavigate();
  const { info } = useAppSelector((state) => state.student);
  const rootThemes = appThemes();
  const studentThemes = createTheme({
    ...rootThemes,
    typography: { ...themeTypography(), fontFamily: 'DotYouris' }
  });
  const getContentDetail = useCallback(
    async (cancelToken?: CancelToken) => {
      const contentDetail = (await studentClient.getContentDetail(contentId ? +contentId : 0, cancelToken)) || '';
      return contentDetail;
    },
    [contentId]
  );
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    async function redirectPage(cancelToken?: CancelToken) {
      let isRecordContent = false;
      let type = '';
      let redirectUrl = `${STUDENT_APP_ROUTES.StudentProfiles.path}`;
      let hashCode = '';
      //Content QR-Code/Short Link
      if (contentId) {
        const contentDetail = await getContentDetail(cancelToken);
        hashCode = contentDetail.classHashCode ?? '';
        isRecordContent = contentDetail.type === ContentType.Record;
        type = 'content';
      }
      if (classHashCode) {
        hashCode = classHashCode;
        type = 'class';
      }
      if (hashCode) {
        redirectUrl += `?class=${hashCode}`;
      }
      const isClassCompleted = type ? await studentClient.checkClassIsCompleted(hashCode) : false;
      if (isClassCompleted && type === 'class') {
        redirectUrl = 'class-completed';
      }
      return navigate(redirectUrl, { state: { type, isClassCompleted: isClassCompleted || isRecordContent } });
    }
    console.log(window.location.pathname)
    if (!info && !['/student/profiles','/student/class-completed'].includes(window.location.pathname)) {
      redirectPage(cancelToken.token);
    }
    return () => {
      cancelToken.cancel();
    };
  }, [info, navigate, getContentDetail, contentId, classHashCode]);

  return (
    <ThemeProvider theme={studentThemes}>
      <GlobalDialog />
      <GlobalAlert />
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', background: '#F9F9FB' }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentLayout;
