import { TypographyOptions } from '@mui/material/styles/createTypography';

export default function themeTypography(): TypographyOptions {
  return {
    fontSize: 16,
    allVariants: {
      color: '#000000'
    },
    h6: {
      fontWeight: 500,
      fontSize: '0.75rem'
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 500
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h1: {
      fontSize: '2.125rem',
      fontWeight: 700
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500
    },
    button: {
      textTransform: 'none'
    }
  };
}
