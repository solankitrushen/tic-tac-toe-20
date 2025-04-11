import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import CustomCheckbox from '../forms/theme-elements/CustomCheckbox';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import axios from 'axios';
import { useUserData } from '@/store/useUserData';
import { useRouter } from 'next/navigation';
function CreateTicketModal({ showModal, setShowModal }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { userData } = useUserData();

  const router = useRouter();
  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      console.log(message);
      if (!message) {
        setError('Message is required');
        return;
      }
      const body = {
        userId: userData._id,
        ticketTitle: title,
        messages: [
          {
            senderId: userData._id,
            receiverId: '66ee61958fb8b3b308399d30',
            msg: message,
          },
        ],
      };
      const createTicket = await axios.post('/ticket/create-ticket', body);
      if (createTicket.status === 201) {
        console.log(createTicket.data.data.Ticket);
        router.push(`/Support/ticket/${createTicket.data.data.Ticket.ticketId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={showModal} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle id="create-ticket-title">Create Ticket</DialogTitle>
      <DialogContent>
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="message"
        >
          Ticket Subject <span className="text-red-500">*</span>
        </CustomFormLabel>
        <CustomTextField
          id="title"
          variant="outlined"
          value={title}
          onChange={(e) => {
            if (!e.target.value) setError('Ticket Subject is required');
            else setError('');
            setTitle(e.target.value);
          }}
          fullWidth
        />
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
        >
          <span className="text-red-500 ">{error}</span>
        </CustomFormLabel>
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
          htmlFor="message"
        >
          Message <span className="text-red-500">*</span>
        </CustomFormLabel>
        <CustomTextField
          id="message"
          variant="outlined"
          value={message}
          onChange={(e) => {
            if (!e.target.value) setError('Message is required');
            else setError('');
            setMessage(e.target.value);
          }}
          multiline
          rows={4}
          fullWidth
        />
        <CustomFormLabel
          sx={{
            mt: 0,
          }}
        >
          <span className="text-red-500 ">{error}</span>
        </CustomFormLabel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTicketModal;
