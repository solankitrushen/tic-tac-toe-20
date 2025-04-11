'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AuthForgotPassword from '../../authForms/AuthForgotPassword';
import Image from 'next/image';

export default function ForgotPassword() {
  return (
    <PageContainer title="Forgot Password Page" description="this is Sample page">
      <Grid container justifyContent="center" spacing={0} sx={{ overflowX: 'hidden' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={4}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box p={4}>
            <Typography variant="h4" fontWeight="700">
              Forgot your password?
            </Typography>

            <Typography color="textSecondary" variant="subtitle2" fontWeight="400" mt={2}>
              Please enter the email address associated with your account and We will email you a
              link to reset your password.
            </Typography>
            <AuthForgotPassword />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={8}
          xl={8}
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
