import { AccountCircle } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Toolbar,
  Typography
} from '@mui/material';
import { useAppContext } from 'app/AppContext';
import { AuthActionTypes } from 'features/auth/login-reducer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ANONYMOUS_ROUTES } from 'app/AppRoutes';

interface IProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}
export default function AdminHeader({ open, setOpen }: IProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    dispatch,
    state: {
      auth: { info: authInfo }
    }
  } = useAppContext();

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    dispatch({ type: AuthActionTypes.AUTH_LOG_OUT });
    return navigate(`/${ANONYMOUS_ROUTES.Login.path}`, { replace: true });
  };

  const displayName = `${authInfo?.firstName} ${authInfo?.lastName}`;
  return (
    <MuiAppBar position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ paddingLeft: '8px !important', justifyContent: 'space-between' }}>
        {/* Toggle NavDrawer */}
        <ListItem
          onClick={toggleDrawer}
          sx={{
            cursor: 'pointer',
            color: '#FFF',
            width: 'auto',
            pl: 0,
            '& svg': {
              color: '#FFF'
            }
          }}
        >
          <ListItemIcon sx={{ width: '15px', minWidth: '15px', pl: 0.5 }} id="btn-drawer">
            <IconButton>
              <MenuIcon />
            </IconButton>
          </ListItemIcon>
        </ListItem>
        {/* Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="#FFF">
            {displayName}
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}
