import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Màu xanh chủ đạo
    },
    secondary: {
      main: '#dc004e', // Màu hồng phụ
    },
    background: {
      default: '#f5f5f5', // Màu nền mặc định
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default theme;