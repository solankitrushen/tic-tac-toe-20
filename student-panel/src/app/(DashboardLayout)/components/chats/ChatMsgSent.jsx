import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { IconPaperclip, IconPhoto, IconSend } from '@tabler/icons-react';
import axios from 'axios';
import { useUserData } from '@/store/useUserData';

const ChatMsgSent = ({ chatDetails, setFetchMsg, fetchMsg }) => {
  const [msg, setMsg] = React.useState('');
  const dispatch = useDispatch();
  const handleChatMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const { userData } = useUserData();

  const onChatMsgSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('newMsg', msg);
    const updateTicket = await axios.post('/ticket/update-ticket', {
      ticketId: chatDetails.ticketId,
      senderId: userData._id,
      receiverId: '66ee61958fb8b3b308399d30',
      msg: msg,
    });
    console.log(updateTicket);
    // dispatch(sendMsg(newMsg));
    setFetchMsg(!fetchMsg);
    setMsg('');
  };

  return (
    <Box p={2}>
      {/* ------------------------------------------- */}
      {/* sent chat */}
      {/* ------------------------------------------- */}
      <form
        onSubmit={onChatMsgSubmit}
        style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
      >
        {/* ------------------------------------------- */}
        {/* Emoji picker */}
        {/* ------------------------------------------- */}

        <InputBase
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder="Type a Message"
          size="small"
          type="text"
          inputProps={{ 'aria-label': 'Type a Message' }}
          onChange={handleChatMsgChange.bind(null)}
        />
        <IconButton
          aria-label="delete"
          onClick={() => {
            dispatch(sendMsg(newMsg));
            setMsg('');
          }}
          disabled={!msg}
          color="primary"
        >
          <IconSend stroke={1.5} size="20" />
        </IconButton>
        {/* <IconButton aria-label="delete">
          <IconPhoto stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPaperclip stroke={1.5} size="20" />
        </IconButton> */}
      </form>
    </Box>
  );
};

export default ChatMsgSent;
