import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import themeComponents from './components';
import themePalette from './palette';
import themeTypography from './typography';

export const appThemes = (): Theme => {
  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: {
      mode: 'light',
      primary: {
        main: '#222222'
      },
      secondary: {
        main: '#0085ff'
      },
      success: {
        main: '#23cc24'
      },
      ...themePalette()
    },
    typography: themeTypography(),
    components: themeComponents(),
    transitions: {
      duration: {
        enteringScreen: 200
      }
    }
  };
  const themes = createTheme(themeOptions);

  return themes;
};

export default appThemes;
