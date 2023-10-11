import { Box, ThemeProvider, createTheme } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import LocalizationMenu from 'app/components/header/LocalizationMenu';
import GlobalDialog from 'components/Dialogs/GlobalDialog';
import GlobalAlert from 'components/GlobalAlert';
import { appThemes } from 'styles/theme';
import themeTypography from 'styles/typography';

interface IProps extends React.PropsWithChildren {
  id: string;
}

const AuthPageLayout = ({ children, id = '' }: IProps) => {
  const rootThemes = appThemes();
  const adminThemes = createTheme({ ...rootThemes, typography: { ...themeTypography(), fontFamily: 'Roboto' } });

  return (
    <ThemeProvider theme={adminThemes}>
      <GlobalDialog />
      <GlobalAlert />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {children}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            right: 24
          }}
        >
          <LocalizationMenu />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPageLayout;
