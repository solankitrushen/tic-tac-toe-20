import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

export default function AuthForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading

  const validateEmail = (email) => {
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true); // Set loading to true

    try {
      // Make the API call to request a password reset
      const res = await axios.post('/auth/request-forgot-password', { email }); // Adjust the URL to your API endpoint
      if (res.status === 200) {
        toast.success('Password reset link sent to your email!');
        setEmail('');
      }
    } catch (error) {
      console.error('Failed to send reset email:', error);
      toast.error('Failed to send reset email. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <Stack mt={4} spacing={2}>
          <CustomFormLabel htmlFor="reset-email">Email Address</CustomFormLabel>
          <CustomTextField
            id="reset-email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            error={!!error} // Show error state
            helperText={error} // Display the error message
          />

          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit" // Submit the form
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" /> // Show loader inside button
            ) : (
              'Request Password Change'
            )}
          </Button>
          <Button
            color="primary"
            size="large"
            disabled={loading} // Disable button while loading
            fullWidth
            component={Link}
            href="/auth/login"
          >
            Back to Login
          </Button>
        </Stack>
      </form>
    </>
  );
}
