import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useUserData } from '@/store/useUserData';
import Link from 'next/link';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const initialValues = {
    email: '',
    password: '',
  };

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const { setUserData } = useUserData();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .required('Password is required'),
  });

  const handleSubmit = async (values) => {
    setLoading(true); // Set loader to true when submitting
    try {
      const res = await axios.post('/auth/login', values);
      if (res.status === 200) {
        toast.success('Congratulations!! You have successfully signed in!!', {
          icon: '🚀',
        });

        if (process.env.NODE_ENV === 'production') {
          Cookies.set('token', res.data.token, { expires: 15 });
        } else {
          Cookies.set('token', res.data.token, { expires: 15 });
        }

        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(`Sorry!! Your email or password is incorrect`);
      } else if (error.response.status === 401) {
        toast.error(`Please check your Email or password!!`);
      } else {
        toast.error(`Sorry!! You could not successfully sign in!!`);
      }
    } finally {
      setLoading(false); // Reset loader to false after submission
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Toaster />
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box mt="-10px">
            <CustomFormLabel>Email Address</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
          <Box mb={3}>
            <CustomFormLabel>Password</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="contained"
            type="submit"
            disabled={loading} // Disable button while loading
            startIcon={loading ? <CircularProgress size={20} /> : null} // Show loader in button
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </form>
      <Stack justifyContent="end" direction="row" alignItems="center" my={2}>
        <Typography
          component={Link}
          href="/auth/forgotPassword"
          fontWeight="500"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
          }}
        >
          Forgot Password ?
        </Typography>
      </Stack>
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box>
      <AuthSocialButtons title="Sign in with" />

      {subtitle}
    </>
  );
};

export default AuthLogin;
