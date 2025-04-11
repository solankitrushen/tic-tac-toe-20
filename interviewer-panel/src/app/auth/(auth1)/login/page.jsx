'use client';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import AuthLogin from '../../authForms/AuthLogin';
import Image from 'next/image';

export default function Login() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <AuthLogin
              title="Welcome back!"
              subtext={
                <Typography variant="h6" mt={2} mb={5}>
                  Enter your Credentials to access your account
                </Typography>
              }
              subtitle={
                <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="500">
                    Don't have Account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/auth/register"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Sign Up
                  </Typography>
                </Stack>
              }
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={6}
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '0.3',
              overflow: 'hidden',
            },
          }}
        >
          <Box position="relative">
            <Box
              alignItems="center"
              justifyContent="center"
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },
              }}
            >
              <img
                src={'/images/backgrounds/login.jpg'}
                alt="bg"
                className="w-full h-screen object-cover"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
