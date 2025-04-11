import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
// import BlankCard from '../shared/BlankCard';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function ChangePasswordModal({ open, handleClose, email_token }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true); // Set loading to true
      try {
        if (values.newPassword != values.confirmPassword) {
          toast.error(`Password and confirm password must be match`);
          return;
        }
        const res = await axios.post(`/auth/forgotPassword/verify/${email_token}`, {
          newPassword: values.newPassword,
        });
        if (res.status === 200) {
          toast.success('Password updated successfully');
          resetForm();
          router.push('/auth/login');
          handleClose();
        }
      } catch (error) {
        console.error('Error changing password:', error);
        if (error.response && error.response.status === 400) {
          toast.error('Current Password is incorrect!');
        } else {
          toast.error('Password not updated!');
        }
      } finally {
        setLoading(false); // Reset loading state after submission
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <Toaster />
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Typography color="textSecondary" mb={3}>
          To change your password, please confirm here.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <CustomFormLabel htmlFor="newPassword">New Password</CustomFormLabel>
          <CustomTextField
            id="newPassword"
            name="newPassword"
            variant="outlined"
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <CustomFormLabel htmlFor="confirmPassword">Confirm Password</CustomFormLabel>
          <CustomTextField
            id="confirmPassword"
            name="confirmPassword"
            variant="outlined"
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className=" flex justify-end gap-3 mt-3">
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordModal;
