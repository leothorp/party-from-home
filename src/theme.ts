import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    alternateBackgroundColor: string;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    alternateBackgroundColor?: string;
  }
}

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#F22F46',
    },
    background: {
      default: '#000',
      paper: '#333333',
    },
  },
  sidebarWidth: 260,
  alternateBackgroundColor: '#1F1F1F',
});
