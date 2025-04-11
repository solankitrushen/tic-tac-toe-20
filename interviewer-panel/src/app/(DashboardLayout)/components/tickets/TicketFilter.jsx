'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibilityFilter } from '../../../../store/tickets/TicketSlice';

const BoxStyled = styled(Box)(() => ({
  padding: '30px',
  transition: '0.1s ease-in',
  cursor: 'pointer',
  color: 'inherit',
  '&:hover': {
    transform: 'scale(1.03)',
  },
}));

const TicketFilter = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.ticketReducer.tickets);
  const pendingC = counter.filter((t) => t.ticketStatus === 'processing').length;
  const openC = counter.filter((t) => t.ticketStatus === 'created').length;
  const closeC = counter.filter((t) => t.ticketStatus === 'completed').length;

  return (
    <Grid container spacing={3} textAlign="center">
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('total_tickets'))}
          sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
        >
          <Typography variant="h3">{counter.length}</Typography>
          <Typography variant="h6">Total Tickets</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('created'))}
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        >
          <Typography variant="h3">{openC}</Typography>
          <Typography variant="h6">Open Tickets</Typography>
        </BoxStyled>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('processing'))}
          sx={{ backgroundColor: 'warning.light', color: 'warning.main' }}
        >
          <Typography variant="h3">{pendingC}</Typography>
          <Typography variant="h6">Processing Tickets</Typography>
        </BoxStyled>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <BoxStyled
          onClick={() => dispatch(setVisibilityFilter('completed'))}
          sx={{ backgroundColor: 'error.light', color: 'error.main' }}
        >
          <Typography variant="h3">{closeC}</Typography>
          <Typography variant="h6">Closed Tickets</Typography>
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default TicketFilter;
