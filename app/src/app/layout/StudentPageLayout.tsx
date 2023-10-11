import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  SxProps,
  Theme,
  Toolbar,
  Typography
} from '@mui/material';
import StudentFooter from 'app/components/header/StudentFooter';
import StudentHeader from 'app/components/header/StudentHeader';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps extends React.PropsWithChildren {
  title: string;
  id: string;
  onBack?: () => void;
  filters?: {
    sxToolbar?: SxProps<Theme>;
    options: {
      id: number;
      title: string;
    }[];
    onClick: (data: any) => void;
  };
}

const StudentPageLayout = ({ title, children, id = '', onBack, filters }: IProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StudentHeader onBack={onBack} />
      <Box
        data-id={id}
        sx={{
          mt: 8,
          p: {
            sm: 2
          },
          fontFamily: 'DotYouris',
          textAlign: 'center',
          height: {
            xs: 'calc(100vh - 272px)',
            sm: 'calc(100vh - 293px)'
          },
          pt: 2,
          overflowY: 'auto'
        }}
      >
        {filters ? (
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: {
                lg: '1000px'
              },
              padding: {
                lg: '0px'
              },
              margin: 'auto',
              ...(filters?.sxToolbar || {})
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'flex-start'
              }}
            >
              <Button
                aria-controls="menu-appbar"
                aria-haspopup="true"
                startIcon={<FilterListIcon />}
                sx={{
                  color: '#1C1939',
                  fontWeight: 700,
                  border: '1px solid black',
                  borderRadius: '20px',
                  textTransform: 'capitalize'
                }}
                onClick={handleMenu}
              >
                {t('common.filters')}
              </Button>
              <Menu
                id="menu-appbar"
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
                {filters?.options.map((item) => {
                  return (
                    <MenuItem
                      key={item.title}
                      onClick={() => {
                        filters.onClick(item);
                      }}
                    >
                      <ListItemText>
                        <span style={{ color: '#1C1939' }}>{item.title}</span>
                      </ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>

            <Typography
              variant="h2"
              sx={{
                color: '#9B449B',
                fontSize: 30,
                textTransform: 'uppercase',
                fontWeight: 700,
                margin: 'auto'
              }}
            >
              {title}
            </Typography>
          </Toolbar>
        ) : (
          <Typography variant="h2" sx={{ color: '#9B449B', fontSize: 30, textTransform: 'uppercase', fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        {!isMounted ? (
          <Box
            sx={{
              position: 'absolute',
              width: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ) : (
          <Box
            sx={{
              p: '16px 16px 0 16px'
            }}
          >
            {children}
          </Box>
        )}
      </Box>
      <StudentFooter />
    </>
  );
};

export default StudentPageLayout;
