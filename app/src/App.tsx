import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppContext } from 'app/AppContext';
import AppRouter from 'app/AppRouter';
import { appLang } from 'locales/i18n';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
function App() {
  const { i18n } = useTranslation();
  const {
    state: {
      language: { lang }
    }
  } = useAppContext();

  useEffect(() => {
    const currentLang = lang || appLang.code;
    if (currentLang !== i18n.language) {
      i18n.changeLanguage(currentLang, (error) => {
        if (error) console.log('Change language error:', error);
      });
    }
  }, [i18n, lang]);
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppRouter />
      </LocalizationProvider>
    </StyledEngineProvider>
  );
}

export default App;
