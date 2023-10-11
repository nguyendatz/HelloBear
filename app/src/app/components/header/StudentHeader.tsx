import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Toolbar
} from '@mui/material';
import { useAppSelector } from 'app/store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface IProps {
  onBack?: () => void;
}

export default function StudentHeader({ onBack }: IProps) {
  const { info } = useAppSelector((state) => state.student);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigationItems = [
    {
      path: `/student/unit-list?classId=${info?.classId}`,
      icon: '/icons/unit.png',
      activeIcon: '/icons/unit-active.png',
      title: 'navigation.UnitList'
    },
    {
      path: 'community/:mode',
      icon: '/icons/community.png',
      activeIcon: '/icons/community-active.png',
      title: 'navigation.Community'
    },
    {
      path: '/student/game',
      icon: '/icons/game.png',
      activeIcon: '/icons/game-active.png',
      title: 'navigation.Game'
    }
  ];

  return (
    <MuiAppBar position="absolute" sx={{ background: '#fff', boxShadow: 'none' }}>
      <Toolbar
        sx={{
          padding: {
            md: '0 100px !important'
          },
          justifyContent: 'space-between'
        }}
      >
        {onBack ? (
          <IconButton onClick={() => onBack()}>
            <Box component="img" src={'/icons/arrow-left.png'} />
          </IconButton>
        ) : (
          <Box />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            aria-controls="menu-appbar"
            aria-haspopup="true"
            startIcon={<Box component="img" src={'/icons/menu.png'} />}
            sx={{ color: '#1C1939', fontWeight: 700 }}
            onClick={handleMenu}
          >
            {t('common.menu')}
          </Button>
          <Menu
            id="menu-appbar"
            PopoverClasses={{}}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '20px',
                  border: '3px solid #9B449B',
                  padding: '10px 10px 2px 10px'
                }
              }
            }}
          >
            {navigationItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <MenuItem
                  key={item.title}
                  onClick={() => {
                    navigate(item.path);
                  }}
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <Box component="img" src={isActive ? item.activeIcon : item.icon} />
                  </ListItemIcon>
                  <ListItemText>
                    <span style={{ color: isActive ? '#9B449B' : '#1C1939' }}>{t(item.title)}</span>
                  </ListItemText>
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}
