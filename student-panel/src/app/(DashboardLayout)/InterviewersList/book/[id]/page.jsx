// app/(DashboardLayout)/InterviewersList/book/[id]/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Rating,
  useMediaQuery,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarMonth,
  Schedule,
  AttachMoney,
  Star,
  ArrowBack,
  CheckCircle,
  Payment,
  Person,
  Work,
  AccessTime,
  Check,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';

const InterviewerBookingPage = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [interviewer, setInterviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Get the interviewer data from localStorage which was set by the parent page
    const fetchInterviewer = async () => {
      try {
        const storedInterviewers = JSON.parse(localStorage.getItem('interviewers')) || [];
        const foundInterviewer = storedInterviewers.find((i) => i.id === params.id);

        if (!foundInterviewer) {
          throw new Error('Interviewer not found');
        }

        setInterviewer(foundInterviewer);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInterviewer();
  }, [params.id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const availableTimes =
    interviewer?.availability
      .filter((slot) => slot.date === selectedDate)
      .map((slot) => slot.startTime) || [];

  const calculateTotal = () => duration * interviewer?.price || 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBookingSuccess(true);
    setProcessingPayment(false);
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );

  if (bookingSuccess) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4, borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your mock interview with {interviewer.name} has been scheduled successfully.
            </Typography>
            <Box
              sx={{
                textAlign: 'left',
                mb: 4,
                p: 3,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Typography>
                <strong>Date:</strong> {selectedDate}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selectedTime}
              </Typography>
              <Typography>
                <strong>Duration:</strong> {duration} hour{duration > 1 ? 's' : ''}
              </Typography>
              <Typography>
                <strong>Total:</strong> ${calculateTotal()}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/(DashboardLayout)/InterviewersList')}
              sx={{ mt: 2 }}
            >
              Return to Interviewers
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: isMobile ? 2 : 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mb: 3 }}>
        Back to Interviewers
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Book Interview with {interviewer?.name}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4, mt: 4 }}>
          {/* Interviewer Details Card */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                  <Person fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {interviewer?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={interviewer?.rating} precision={0.1} readOnly size="small" />
                    <Typography sx={{ ml: 1 }}>{interviewer?.rating.toFixed(1)}</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Work sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="subtitle2">Expertise</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {interviewer?.expertise.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.action.selected,
                            color: theme.palette.text.primary,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 2, color: theme.palette.success.main }} />
                  <Box>
                    <Typography variant="subtitle2">Rate</Typography>
                    <Typography>${interviewer?.price}/hour</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 2, color: theme.palette.warning.main }} />
                  <Box>
                    <Typography variant="subtitle2">Availability</Typography>
                    {interviewer?.availability.slice(0, 2).map((slot, index) => (
                      <Typography key={index} variant="body2">
                        {format(parseISO(slot.date), 'MMM d')}: {slot.startTime}-{slot.endTime}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Booking Form Card */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Schedule Your Interview
              </Typography>

              <form onSubmit={handleBookingSubmit}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Date</InputLabel>
                  <Select
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    label="Select Date"
                  >
                    {interviewer?.availability.map((slot, index) => (
                      <MenuItem key={index} value={slot.date}>
                        {format(parseISO(slot.date), 'MMMM d, yyyy')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedDate && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select Time</InputLabel>
                    <Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      label="Select Time"
                    >
                      {availableTimes.map((time, index) => (
                        <MenuItem key={index} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Duration (hours)</InputLabel>
                  <Select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    label="Duration (hours)"
                  >
                    {[1, 1.5, 2].map((hours) => (
                      <MenuItem key={hours} value={hours}>
                        {hours} hour{hours > 1 ? 's' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  margin="normal"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="normal"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={4}
                  margin="normal"
                  placeholder="Any specific topics or areas you'd like to focus on?"
                  sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  Payment Method
                </Typography>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  sx={{ mb: 3 }}
                >
                  <FormControlLabel value="Crypto" control={<Radio />} label="Crypto" />

                  <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                  <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                </RadioGroup>

                <Box
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Total:</Typography>
                    <Typography variant="h6">${calculateTotal()}</Typography>
                  </Box>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!selectedDate || !selectedTime || processingPayment}
                  startIcon={processingPayment ? null : <Payment />}
                >
                  {processingPayment ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Processing Payment...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </motion.div>
    </Box>
  );
};

export default InterviewerBookingPage;
