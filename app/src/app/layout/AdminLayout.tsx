import { Box, ThemeProvider, createTheme } from '@mui/material';
import { authClient } from 'apis';
import { RefreshTokenCommand } from 'apis/nswag';
import { useAppContext } from 'app/AppContext';
import { ANONYMOUS_ROUTES } from 'app/AppRoutes';
import AdminHeader from 'app/components/header/AdminHeader';
import AdminSidebar from 'app/components/sidebar/AdminSidebar';
import { beforeTokenExpiryTimeInSecond } from 'common/consts/configs';
import GlobalDialog from 'components/Dialogs/GlobalDialog';
import GlobalAlert from 'components/GlobalAlert';
import { getUnixTime } from 'date-fns';
import { AuthActionTypes } from 'features/auth/login-reducer';
import { getSavedAuthInfoFromLocalStorage, getTokenExp, isTokenExpired } from 'features/auth/utils';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { appThemes } from 'styles/theme';
import themeTypography from 'styles/typography';

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    dispatch,
    state: {
      auth: { info: authInfo }
    }
  } = useAppContext();

  const tokenExp = getTokenExp(authInfo?.accessToken);
  const remainSecondsBeforeExpire = useMemo(
    () => (tokenExp ? tokenExp - beforeTokenExpiryTimeInSecond - getUnixTime(new Date()) : 0),
    [tokenExp]
  );

  useEffect(() => {
    const refreshToken = async (request: RefreshTokenCommand) => {
      try {
        const refreshTokenResult = await authClient.refreshToken(request);
        dispatch({ type: AuthActionTypes.AUTH_INFO_SET, payload: refreshTokenResult });
      } catch {
        dispatch({ type: AuthActionTypes.AUTH_LOG_OUT });
        navigate(`/${ANONYMOUS_ROUTES.Login.path}`);
      }
    };

    if (!!authInfo?.refreshToken && (tokenExp || remainSecondsBeforeExpire < 0)) {
      const timer = setTimeout(() => {
        const savedAuthInfo = getSavedAuthInfoFromLocalStorage();
        refreshToken({
          accessToken: savedAuthInfo?.accessToken,
          refreshToken: savedAuthInfo?.refreshToken
        });
      }, remainSecondsBeforeExpire * 1000);

      return () => {
        clearTimeout(timer);
      };
    }

    const isLoggedIn = !!authInfo && authInfo?.accessToken && !isTokenExpired(authInfo?.accessToken);

    if (!isLoggedIn) {
      navigate(`/${ANONYMOUS_ROUTES.Login.path}`);
    }
  }, [authInfo, navigate, dispatch, open, remainSecondsBeforeExpire, tokenExp]);
  const rootThemes = appThemes();
  const adminThemes = createTheme({ ...rootThemes, typography: { ...themeTypography(), fontFamily: 'Roboto' } });
  return (
    <ThemeProvider theme={adminThemes}>
      <GlobalDialog />
      <GlobalAlert />
      <Box sx={{ display: 'flex' }}>
        <AdminHeader setOpen={setOpen} open={open} />
        <AdminSidebar open={open} />
        <Box component="main" sx={{ flexGrow: 1, mt: 8, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
