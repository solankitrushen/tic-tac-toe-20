import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { IconHelp } from '@tabler/icons-react';
import BlankCard from '../shared/BlankCard';
import React from 'react';
import Link from 'next/link';

const ProfileBanner = ({ userData }) => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  }));

  return (
    <>
      <BlankCard>
        <CardMedia
          component="img"
          image={'/images/backgrounds/profilebg.jpg'}
          alt={'profilecover'}
          width="100%"
          height="330px"
        />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {/* Post | Followers | Following */}
          <Grid
            item
            lg={4}
            sm={12}
            md={5}
            xs={12}
            sx={{
              order: {
                xs: '2',
                sm: '2',
                lg: '1',
              },
            }}
          >
            {/* <Stack direction="row" textAlign="center" justifyContent="center" gap={6} m={3}>
              <Box>
                <Typography color="text.secondary">
                  <IconFileDescription width="20" />
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  938
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  Posts
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">
                  <IconUserCircle width="20" />
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  3,586
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  Followers
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">
                  <IconUserCheck width="20" />
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  2,659
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  Following
                </Typography>
              </Box>
            </Stack> */}
          </Grid>
          {/* about profile */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '1',
                sm: '1',
                lg: '2',
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: '-85px',
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={
                      userData.profile_photo
                        ? userData.profile_photo
                        : userData.gender === 'male'
                        ? '/images/profile/user-1.jpg'
                        : '/images/profile/user-9.jpg'
                    }
                    alt="profileImage"
                    sx={{
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '4px solid #fff',
                    }}
                  />
                </ProfileImage>
                <Box mt={1} mb={3}>
                  <Typography fontWeight={600} variant="h5">
                    {userData.firstName} {userData.lastName}
                  </Typography>
                  <Typography color="textSecondary" variant="h6" mt="4px" fontWeight={400}>
                    {userData.company_name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* friends following buttons */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '3',
                sm: '3',
                lg: '3',
              },
            }}
          >
            {/* <Stack direction={'row'} gap={2} alignItems="center" justifyContent="center" my={2}>
              <Link href="mailto:support@commerciax.com">
                <Button color="primary" variant="contained">
                  <IconHelp style={{ marginRight: '8px' }} />
                  Send Mail
                </Button>
              </Link>
              <Link href="tel:+919016600610">
                <Button color="primary" variant="contained">
                  <IconHelp style={{ marginRight: '8px' }} />
                  Make a Call
                </Button>
              </Link>
            </Stack> */}
          </Grid>
        </Grid>
      </BlankCard>
    </>
  );
};

export default ProfileBanner;
