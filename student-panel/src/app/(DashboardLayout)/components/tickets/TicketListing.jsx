'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { fetchTickets, DeleteTicket, SearchTicket } from '@/store/tickets/TicketSlice';
import CreateTicketModal from './CreateTicketModal';
import { IconTrash } from '@tabler/icons-react';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TicketListing = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const getVisibleTickets = (tickets, filter, ticketSearch) => {
    switch (filter) {
      case 'total_tickets':
        return tickets.filter(
          (c) => !c.deleted && c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'processing':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.ticketStatus === 'processing' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'completed':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.ticketStatus === 'completed' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'created':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.ticketStatus === 'created' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  };

  const tickets = useSelector((state) =>
    getVisibleTickets(
      state.ticketReducer.tickets,
      state.ticketReducer.currentFilter,
      state.ticketReducer.ticketSearch,
    ),
  );
  const ticketBadge = (ticket) => {
    return ticket.ticketStatus === 'created'
      ? theme.palette.success.light
      : ticket.ticketStatus === 'completed'
      ? theme.palette.error.light
      : ticket.ticketStatus === 'processing'
      ? theme.palette.warning.light
      : 'primary';
  };

  return (
    <Box mt={4}>
      <Box
        sx={{ ml: 'auto', display: 'flex', gap: '10px', justifyContent: 'space-between' }}
        mb={3}
      >
        <TextField
          size="small"
          label="Search"
          onChange={(e) => dispatch(SearchTicket(e.target.value))}
        />
        <Button
          variant="contained"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Create a Ticket
        </Button>
      </Box>
      {showModal && <CreateTicketModal showModal={showModal} setShowModal={setShowModal} />}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>
                <Typography variant="h6">Id</Typography>
              </TableCell> */}
              <TableCell>
                <Typography variant="h6">Ticket</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="h6">Status</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Date</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                className=" cursor-pointer"
                key={ticket.ticketId}
                onClick={() => {
                  router.push(`/Support/ticket/${ticket.ticketId}`);
                }}
                hover
              >
                <TableCell>
                  <Box>
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {ticket.ticketTitle}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      noWrap
                      sx={{ maxWidth: '250px' }}
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {ticket.ticketDescription}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    sx={{
                      backgroundColor: ticketBadge(ticket),
                    }}
                    size="small"
                    label={ticket.ticketStatus}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {format(new Date(ticket.createdAt), 'E, MMM d')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Box my={3} display="flex" justifyContent={'center'}>
        <Pagination count={10} color="primary" />
      </Box> */}
    </Box>
  );
};

export default TicketListing;
