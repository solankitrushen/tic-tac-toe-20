'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';

import AuthRegister from '../../authForms/AuthRegister';
import Image from 'next/image';

export default function Register() {
  return (
    <PageContainer title="Register Page" description="this is Sample page">
      <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
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
          <Box p={4}>
            <AuthRegister
              title="Get Started Now"
              // subtext={
              //   <Typography variant="subtitle1" color="textSecondary" mb={1}>
              //     Your Admin Dashboard
              //   </Typography>
              // }
              subtitle={
                <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    Have an account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/auth/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Sign In
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
