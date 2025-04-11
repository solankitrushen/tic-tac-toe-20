import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconDotsVertical, IconMenu2, IconPhone, IconVideo } from '@tabler/icons-react';

import { formatDistanceToNowStrict } from 'date-fns';
import Image from 'next/image';
import { useUserData } from '@/store/useUserData';
import { Chip } from '@mui/material';
import { useTheme } from '@emotion/react';

const ChatContent = ({ chatDetails }) => {
  const [open, setOpen] = React.useState(true);
  const { userData } = useUserData();
  const theme = useTheme();
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
    <Box>
      {chatDetails ? (
        <Box>
          {/* ------------------------------------------- */}
          {/* Header Part */}
          {/* ------------------------------------------- */}
          <Box>
            <Box display="flex" alignItems="center" p={2}>
              <ListItem key={chatDetails._id} dense disableGutters>
                <ListItemAvatar>
                  <Badge
                    color={
                      chatDetails.status === 'online'
                        ? 'success'
                        : chatDetails.status === 'busy'
                        ? 'error'
                        : chatDetails.status === 'away'
                        ? 'warning'
                        : 'secondary'
                    }
                    variant="dot"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    overlap="circular"
                  >
                    <Avatar
                      alt="logo"
                      src="/images/logos/main-logo-symbol-dark.png"
                      sx={{ width: 40, height: 40 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="h5">Neweb.ai</Typography>}
                  secondary="Online"
                />
              </ListItem>
              <Stack direction={'row'}>
                <Chip
                  sx={{
                    backgroundColor: ticketBadge(chatDetails),
                  }}
                  size="small"
                  label={chatDetails.ticketStatus}
                />
              </Stack>
            </Box>
            <Divider />
          </Box>
          {/* ------------------------------------------- */}
          {/* Chat Content */}
          {/* ------------------------------------------- */}

          <Box display="flex">
            {/* ------------------------------------------- */}
            {/* Chat msges */}
            {/* ------------------------------------------- */}

            <Box width="100%">
              <Box
                sx={{
                  height: '650px',
                  overflow: 'auto',
                  maxHeight: '800px',
                }}
              >
                <Box p={3}>
                  {chatDetails.messages?.map((chat) => {
                    return (
                      <Box key={chat.id + chat.createdAt}>
                        {userData._id === chat.receiverId ? (
                          <Box display="flex">
                            <ListItemAvatar>
                              <Avatar
                                alt="logo"
                                src="/images/logos/main-logo-symbol-dark.png"
                                sx={{ width: 40, height: 40 }}
                              />
                            </ListItemAvatar>
                            <Box>
                              {chat.createdAt ? (
                                <Typography variant="body2" color="grey.400" mb={1}>
                                  Neweb.ai,{' '}
                                  {formatDistanceToNowStrict(new Date(chat.createdAt), {
                                    addSuffix: false,
                                  })}{' '}
                                  ago
                                </Typography>
                              ) : null}

                              <Box
                                mb={2}
                                sx={{
                                  p: 1,
                                  backgroundColor: 'grey.100',
                                  mr: 'auto',
                                  maxWidth: '320px',
                                }}
                              >
                                {chat.msg}
                              </Box>
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            mb={1}
                            display="flex"
                            alignItems="flex-end"
                            flexDirection="row-reverse"
                          >
                            <Box alignItems="flex-end" display="flex" flexDirection={'column'}>
                              {chat.createdAt ? (
                                <Typography variant="body2" color="grey.400" mb={1}>
                                  {formatDistanceToNowStrict(new Date(chat.createdAt), {
                                    addSuffix: false,
                                  })}{' '}
                                  ago
                                </Typography>
                              ) : null}

                              <Box
                                mb={1}
                                sx={{
                                  p: 1,
                                  backgroundColor: 'primary.light',
                                  ml: 'auto',
                                  maxWidth: '320px',
                                }}
                              >
                                {chat.msg}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* ------------------------------------------- */}
            {/* Chat right sidebar Content */}
            {/* ------------------------------------------- */}
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
          {/* ------------------------------------------- */}
          {/* if No Chat Content */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'flex', lg: 'none' },
              mr: '10px',
            }}
          >
            <IconMenu2 stroke={1.5} onClick={toggleChatSidebar} />
          </Box>
          <Typography variant="h4">Select Chat</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
