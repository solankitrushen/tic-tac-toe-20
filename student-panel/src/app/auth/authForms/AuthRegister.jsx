import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Grid, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Api, Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/store/useUserData';
import Link from 'next/link';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const router = useRouter();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm_password: '',
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [showResendMail, setShowResendMail] = useState(false); // Loader state

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const { setUserData } = useUserData();

  const validationSchema = yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .matches(/\d/, 'Password must contain at least one number') // Enforces at least one number
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // Enforces at least one uppercase letter
      .required('Password is required'),
    confirm_password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .matches(/\d/, 'Password must contain at least one number') // Enforces at least one number
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // Enforces at least one uppercase letter
      .required('Password is required'),
  });

  const handleSubmit = async (values) => {
    if (values.password != values.confirm_password) {
      console.log('Password and confirm password must be match');
      toast.error(`Password and confirm password must be match`);
      return;
    }
    setLoading(true); // Start the loader
    try {
      console.log(values);
      const res = await axios.post('/auth/register', values);
      console.log(res);
      if (res.status === 201) {
        toast.success('You are registered successfully. Please verify your email.', {
          icon: '🚀',
        });
        setShowResendMail(true);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(`Sorry!! Your email already exists!!`);
      } else {
        toast.error(`Sorry!! You couldn't sign up successfully!!`);
      }
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleResendMail = async () => {
    try {
      if (!formik.values.email) {
        toast.error(`Sorry!! Email is not provided !!`);
        return;
      }
      const res = await axios.post('/resend-verification-email', { email: formik.values.email });
      console.log(res);
      if (res.status === 200) {
        toast.success('Mail send successfully!', {
          icon: '🚀',
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(`Email already sent !!`);
      } else {
        toast.error(`Sorry!! Mail is not sent successfully!!`);
      }
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <AuthSocialButtons title="Sign up with" />
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
            or sign up with
          </Typography>
        </Divider>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Grid container spacing={2} sx={{ mt: '-10px' }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel>First Name</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Last Name</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
          </Grid>

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

          <Box mt="-10px">
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

          <Box mb={3}>
            <CustomFormLabel>Confirm Password</CustomFormLabel>
            <CustomTextField
              fullWidth
              id="confirm_password"
              name="confirm_password"
              type={showPassword1 ? 'text' : 'password'}
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
              helperText={formik.touched.confirm_password && formik.errors.confirm_password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword1}
                      edge="end"
                    >
                      {showPassword1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            variant="contained"
            type="submit"
            disabled={loading} // Disable the button during loading
          >
            {loading ? <CircularProgress size={24} /> : 'Sign up'} {/* Show loader when loading */}
          </Button>
          {showResendMail && (
            <Stack justifyContent="end" direction="row" alignItems="center" mt={2}>
              <Typography
                component={Button}
                onClick={handleResendMail}
                fontWeight="500"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                }}
              >
                Resend Verification mail ?
              </Typography>
            </Stack>
          )}
        </Stack>
      </form>

      {subtitle}
    </>
  );
};

export default AuthRegister;
