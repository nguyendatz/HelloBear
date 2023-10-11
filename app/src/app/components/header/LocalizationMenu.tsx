import { Box, Button, ButtonProps, Menu, MenuItem } from '@mui/material';
import { useAppContext } from 'app/AppContext';
import { LanguageActionTypes } from 'app/reducers/languageReducer';
import { appLang } from 'locales/i18n';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  btnProps?: ButtonProps;
}

const LocalizationMenu = ({ btnProps = {} }: IProps) => {
  const {
    state: {
      language: { lang: crrLang }
    },
    dispatch
  } = useAppContext();
  const { t } = useTranslation();
  const [anchorElLocalization, setAnchorElLocalization] = useState<null | HTMLElement>(null);
  const openLocalizationMenu = Boolean(anchorElLocalization);
  const handleOpenLocalizationMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElLocalization(event.currentTarget);
  };
  const handleCloseLocalizationMenu = (language: keyof typeof appLang.languages) => {
    if (typeof language === 'string') {
      dispatch({
        type: LanguageActionTypes.LANGUAGE_SET,
        payload: language
      });
    }
    setAnchorElLocalization(null);
  };
  const langs = Object.values(appLang?.languages || []);
  return (
    <Box>
      <Button
        id="localization-button"
        aria-controls={openLocalizationMenu ? 'localization-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openLocalizationMenu ? 'true' : undefined}
        onClick={handleOpenLocalizationMenu}
        sx={{ ...(btnProps?.sx || {}) }}
        variant="outlined"
        {...btnProps}
      >
        {t(`language.${crrLang}`)}
      </Button>
      <Menu
        id="localization-menu"
        anchorEl={anchorElLocalization}
        open={openLocalizationMenu}
        onClose={handleCloseLocalizationMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {langs.map((code, index) => (
          <MenuItem
            key={`lang-${index}`}
            value={code}
            onClick={() => handleCloseLocalizationMenu(code as keyof typeof appLang.languages)}
          >
            {t(`language.${code}`)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LocalizationMenu;
