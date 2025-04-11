'use client';
import Grid from '@mui/material/Grid';
import ProfileBanner from '../components/profile/ProfileBanner';
import ChangePassword from '../components/profile/ChangePassword';
import IntroCard from '../components/profile/IntroCard';
import PageContainer from '../components/container/PageContainer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserData } from '@/store/useUserData';

const UserProfile = () => {
  const [userProfileData, setUserData] = useState([]);
  const { userData } = useUserData();
  const router = useRouter();
  // useEffect(() => {
  //   const fetchWebsites = async () => {
  //     try {
  //       const res = await axios.get(`/project/userId/${userData.userId}`);
  //       console.log(res.data);
  //       setWebsiteCards(res.data.data.Projects);
  //       if (res.status === 200) {
  //         toast.success('websites fetched successfully');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       if (error.response.status === 404) {
  //         toast.error('No Projects found!!');
  //       }
  //       if (error.response.data.message === 'invalid token') {
  //         router.push('/auth/login');
  //       } else {
  //         toast.error('Some internal error');
  //       }
  //     }
  //   };
  //   if (userData.userId) {
  //     fetchWebsites();
  //   }
  // }, [userData]);

  return (
    <PageContainer title="Profile" description="this is Profile">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner userData={userData} />
        </Grid>

        <Grid item sm={6}>
          <IntroCard userData={userData} />
        </Grid>
        <Grid item sm={6}>
          <ChangePassword userData={userData} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserProfile;
