'use client';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RTL from '@/app/(DashboardLayout)/layout/shared/customizer/RTL';
import { ThemeSettings } from '@/utils/theme/Theme';
import { store } from '@/store/store';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '@/utils/i18n';
import { NextAppDirEmotionCacheProvider } from '@/utils/theme/EmotionCache';
import 'tailwindcss/tailwind.css';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserDataProvider } from '@/store/useUserData';

export const MyApp = ({ children }) => {
  const theme = ThemeSettings();

  const customizer = useSelector((state) => state.customizer);

  return (
    <>
      <Toaster />
      <NextAppDirEmotionCacheProvider options={{ key: 'modernize' }}>
        <ThemeProvider theme={theme}>
          <SessionProvider>
            <RTL direction={customizer.activeDir}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <UserDataProvider>{children}</UserDataProvider>
            </RTL>
          </SessionProvider>
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
};

export default function RootLayout({ children }) {
  const [loading, setLoading] = React.useState(false);

  if (process.env.NODE_ENV === 'production') {
    // for production
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_PROD_AXIOS_URL;
  } else {
    // for local
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_AXIOS_URL;
  }
  axios.defaults.withCredentials = true;

  React.useEffect(() => {
    setTimeout(() => setLoading(true), 300);
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
      <body>
        <Provider store={store}>
          {loading ? (
            // eslint-disable-next-line react/no-children-prop
            <MyApp children={children} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100vh',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Provider>
      </body>
    </html>
  );
}
