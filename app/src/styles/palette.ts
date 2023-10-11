import { PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    color: {
      white: string;
    };
    borderColor: string;
  }
  interface PaletteOptions {
    color?: {
      white: string;
    };
    borderColor: string;
  }
  interface TypeBackground {
    sidebar?: string;
    header?: string;
  }
  interface TypeAction {
    menuItemHover?: string;
    menuItemSelected?: string;
  }
  interface TypeCell {
    menuItemHover?: string;
    menuItemSelected?: string;
  }
  interface TypeText {
    main?: string;
  }
}

export default function themePalette(): PaletteOptions {
  return {
    background: {},
    text: {
      main: ''
    },
    action: {
      menuItemHover: 'rgba(224,234,235, 0.7)',
      menuItemSelected: 'rgb(224,234,235)'
    },
    color: {
      white: '#FFF'
    },
    borderColor: '#DADCE0'
  };
}
