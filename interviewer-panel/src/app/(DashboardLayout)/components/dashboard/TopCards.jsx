'use client';
import Image from 'next/image';
import { Box, CardContent, Typography } from '@mui/material';


const TopCards = () => {
  return (
    <>
      <div className="flex  justify-between space-x-6">
        {' '}
        {/* Flex container with spacing between cards */}
        {topcards.map((topcard, i) => (
          <Box
            key={i} // Add a key to avoid React warnings
            sx={{
              p: 1, // Adjust padding
              flexGrow: 1, // Allow cards to take up available space equally
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: `${topcard.bgcolor}.light`,
              textAlign: 'center',
              minWidth: '200px', // Set a minimum width for the cards
            }}
          >
            <CardContent>
              <Image src={topcard.icon} alt={topcard.title} width={80} height={80} /> {/* Icon */}
              <Typography color={`${topcard.bgcolor}.main`} mt={2} variant="h5" fontWeight={700}>
                {topcard.title}
              </Typography>
              <Typography color={`${topcard.bgcolor}.main`} variant="h3" fontWeight={700} mt={1}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        ))}
      </div>
    </>
  );
};

export default TopCards;
