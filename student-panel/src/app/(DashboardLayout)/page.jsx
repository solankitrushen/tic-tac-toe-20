'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// components
import WelcomeCard from './components/dashboard/WelcomeCard';
import PageContainer from './components/container/PageContainer';
import { useUserData } from '@/store/useUserData';

export default function Dashboard() {
  useUserData();

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <WelcomeCard />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
