import { Components, Theme } from '@mui/material';

import themePalette from './palette';

export default function themeComponent(): Components<Theme> {
  const colors = themePalette();

  return {
    MuiCheckbox: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'small'
      }
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small'
      }
    },
    MuiInput: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiChip: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        tag: {
          marginTop: 0,
          marginBottom: 0
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F5F6F8',
          borderRight: 'none'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: colors.text?.main
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.borderColor}`,
          borderTop: 'unset'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: 16,
          pt: 3,
          pb: 0
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          lineHeight: 1.5,
          fontWeight: 400
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          lineHeight: 1.5
        },
        contained: {
          ':hover': {
            color: 'white'
          },
          boxShadow: 'none',
          fontWeight: '500'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          border: '1px solid #C9C9C9'
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#FF0000'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#FB8B46',
            borderColor: '#373985',
            borderRadius: '4px 4px 0 0'
          }
        },
        textColorPrimary: {
          color: '#ACACAC'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#FB8B46'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          '&.MuiDivider-vertical': {
            marginRight: '-1px'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            margin: '0 !important'
          }
        }
      }
    }
  };
}
