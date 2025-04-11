'use client';
import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import Image from 'next/image';
import { useUserData } from '@/store/useUserData';
import Link from 'next/link';
import moment from 'moment-timezone';

const getPlanName = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);

  // Calculate the difference in months and years
  const monthsDiff = end.diff(start, 'months');
  const yearsDiff = end.diff(start, 'years');

  if (yearsDiff >= 1) {
    return 'Yearly';
  } else if (monthsDiff === 1) {
    return 'Monthly';
  } else {
    return 'Other Plan'; // fallback for other durations
  }
};

const PlanName = ({ startDate, endDate }) => {
  const planName = getPlanName(startDate, endDate);

  return <span>{planName}</span>;
};

const WelcomeCard = ({ subscription, creditUsageLog }) => {
  const { userData } = useUserData();

  const topcards = [
    {
      icon: '/images/svgs/icon-speech-bubble.svg',
      title: 'Total Credits Available',
      digits: 1000,
      bgcolor: 'success',
    },
    {
      icon: '/images/svgs/icon-mailbox.svg',
      title: 'Total Credits Used',
      digits: 0,
      bgcolor: 'secondary',
    },
  ];
  console.log(subscription);

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <Grid container spacing={3}>
        {/* Welcome and Subscription Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              py: 0,
              backgroundColor: (theme) => theme.palette.primary.light,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for a lifted look
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ py: 4, px: 2 }}>
              <Grid container>
                <Grid item sm={12}>
                  <Box>
                    <Box
                      gap="16px"
                      mb={5}
                      sx={{
                        display: {
                          xs: 'block',
                          sm: 'flex',
                        },
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        src={
                          userData.profile_photo
                            ? userData.profile_photo
                            : userData.gender === 'male'
                            ? '/images/profile/user-1.jpg'
                            : '/images/profile/user-9.jpg'
                        }
                        alt="img"
                        sx={{ width: 48, height: 48 }} // Slightly larger avatar
                      />
                      <Typography variant="h5" whiteSpace="nowrap">
                        Welcome back, {userData.firstName}!
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Cards */}
        <Grid item xs={12} md={6} container spacing={3}>
          {topcards.map((topcard, i) => (
            <Grid item xs={12} sm={6} key={i}>
              {' '}
              {/* Each top card takes 6 columns on medium screens */}
              <Card
                elevation={2}
                sx={{
                  bgcolor: `${topcard.bgcolor}.light`,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add soft shadow
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CardContent className="flex flex-col justify-center items-center">
                  <Image src={topcard.icon} alt={topcard.title} width={64} height={64} />{' '}
                  {/* Icon */}
                  <Typography mt={2} variant="h6" fontWeight={600}>
                    {topcard.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} mt={1}>
                    {topcard.digits}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default WelcomeCard;
