'use client';
import React, { useEffect, useState } from 'react';
// import ChatSidebar from '@/app/(DashboardLayout)/components/chats/ChatSidebar';
import ChatContent from './ChatContent';
import ChatMsgSent from './ChatMsgSent';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import axios from 'axios';
const ChatsApp = ({ ticketId }) => {
  const [chatDetails, setChatDetails] = React.useState({});
  const [fetchMsg, setFetchMsg] = React.useState(false);

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const chat = await axios.get(`/ticket/get-ticket/${ticketId}`);
        console.log(chat.data.Ticket);
        setChatDetails(chat.data.Ticket);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChatDetails();
  }, [fetchMsg]);

  return (
    <>
      <Box flexGrow={1}>
        <ChatContent chatDetails={chatDetails} ticketId={ticketId} />
        <Divider />
        <ChatMsgSent chatDetails={chatDetails} setFetchMsg={setFetchMsg} fetchMsg={fetchMsg} />
      </Box>
    </>
  );
};

export default ChatsApp;
