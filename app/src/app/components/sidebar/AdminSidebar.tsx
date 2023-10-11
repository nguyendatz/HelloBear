import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { CSSObject, Theme, useTheme } from '@mui/material/styles';
import { NavLink, useLocation } from 'react-router-dom';

import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { ADMIN_APP_ROUTES } from 'app/AppRoutes';
import { Roles } from 'common/consts/roles';
import { RouteItem } from 'common/types/Routers';
import useAccessControl from 'features/auth/access-control/useAccessControl';
import produce from 'immer';
import { useTranslation } from 'react-i18next';

const drawerWidth = 275;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(6)} + 10px)`,
  [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(6)} + 10px)` }
});

interface IProps {
  open: boolean;
}

export const AdminSideBar = ({ open }: IProps) => {
  const theme = useTheme();
  const location = useLocation();
  const { t } = useTranslation();
  const { isValidRole } = useAccessControl();
  const isActive = (route: RouteItem) => {
    return location.pathname.includes(route.path);
  };
  const navigationItems = [
    {
      path: `${ADMIN_APP_ROUTES.UserList.path}`,
      title: 'navigation.UserManagement',
      iconComponent: GroupOutlinedIcon,
      component: '',
      exact: undefined,
      allowedRoles: [Roles.Administrator]
    },
    {
      path: `${ADMIN_APP_ROUTES.ClassManagement.path}`,
      title: 'navigation.ClassManagement',
      iconComponent: GridViewOutlinedIcon,
      component: '',
      exact: undefined,
      allowedRoles: [Roles.Administrator, Roles.Teacher]
    },
    {
      path: `${ADMIN_APP_ROUTES.ContentManagement.path}`,
      title: 'navigation.TextBookManagement',
      iconComponent: ListAltOutlinedIcon,
      component: '',
      exact: undefined,
      allowedRoles: [Roles.Administrator]
    },
    {
      path: `${ADMIN_APP_ROUTES.ReportManagement.path}`,
      title: 'navigation.ReportManagement',
      iconComponent: Inventory2OutlinedIcon,
      component: '',
      exact: undefined,
      allowedRoles: [Roles.Administrator]
    }
  ];

  const visibleNavigationItems = produce(navigationItems, (draftGroups) =>
    draftGroups.filter((item: any) => item.allowedRoles && isValidRole(item.allowedRoles))
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme)
        }),
        ...(!open && {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme)
        })
      }}
    >
      <Toolbar />

      <List>
        {visibleNavigationItems
          //.filter((nav) => !nav.hidden)
          .map((route: RouteItem, index) => {
            const Icon = route.iconComponent;

            return (
              <NavLink to={route.path} key={index} style={{ textDecoration: 'none' }}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    color: theme.palette.primary.main,
                    width: '90%',
                    height: 48,
                    mx: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& svg': {
                      color: theme.palette.primary.main
                    },
                    gap: 1,
                    ...(isActive(route) && {
                      color: theme.palette.common.white,
                      backgroundColor: '#64B6E4',
                      borderRadius: '5px',
                      '& svg': {
                        color: theme.palette.common.white
                      },
                      '&:hover': {
                        backgroundColor: '#64B6E4'
                      }
                    })
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'fit-content'
                    }}
                  >
                    {Icon && <Icon />}
                  </ListItemIcon>
                  {open && <ListItemText>{t(`${route.title}`)}</ListItemText>}
                </ListItem>
              </NavLink>
            );
          })}
      </List>
    </Drawer>
  );
};

export default AdminSideBar;
