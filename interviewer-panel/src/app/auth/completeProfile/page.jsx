'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import {
  CircularProgress,
  Stack,
  Box,
  Button,
  Grid,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Avatar,
  Typography,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomFormLabel';
import Cookies from 'js-cookie';
import { useUserData } from '@/store/useUserData';

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // For image preview
  const [imageFile, setImageFile] = useState(null); // To store the uploaded file
  const router = useRouter();
  const { userData, setUserData } = useUserData();
  const validationSchema = yup.object({
    company_name: yup.string().required('Company Name is required'),
    gender: yup.string().required('Gender is required'),
    country: yup.string().required('Country is required'),
    phone_number: yup
      .string()
      .matches(/^\d+$/, 'Phone Number must contain only digits') // Ensures only digits
      .min(10, 'Phone Number must be at least 10 digits') // Minimum length of 10
      .required('Phone Number is required'),
  });

  const formik = useFormik({
    initialValues: {
      company_name: '',
      website: '',
      gender: 'male',
      country: '',
      phone_number: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const token = Cookies.get('access');
      const selectedCountry = countryCodes.find((country) => country.name === values.country);
      const phoneCode = selectedCountry ? selectedCountry.phone_code : '';

      try {
        const formData = new FormData();
        formData.append('company_name', values.company_name);
        formData.append('website', values.website);
        formData.append('gender', values.gender);
        formData.append('country', values.country);
        formData.append('phone_number', `${phoneCode} ${values.phone_number}`); // Append country code to phone number

        if (imageFile) {
          formData.append('profile_photo', imageFile);
        }

        const response = await axios.post('/user/profile/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          toast.success('Profile updated successfully!');
          Cookies.set('userId', response.data.id);
          window.location.href = '/';
        }
      } catch (error) {
        toast.error('Error updating profile.');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get('/user/country-codes/');
        const countryArray = Object.keys(response.data).map((key) => ({
          code: key,
          ...response.data[key],
        }));
        console.log(countryArray);
        setCountryCodes(countryArray);
      } catch (error) {
        console.error('Error fetching country codes:', error);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-3xl mx-auto p-4 shadow-xl bg-[#1C455D] rounded-lg">
        <Toaster />
        <h2 className="text-2xl font-bold text-center mb-4">Complete Your Profile</h2>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Avatar
                src={profileImage ? profileImage : '/default-avatar.png'}
                alt="Profile Image"
                sx={{ width: 150, height: 150 }}
              />
              <Button variant="contained" component="label" sx={{ marginTop: '10px' }}>
                Upload Image
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="company_name">Company Name</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="company_name"
                    name="company_name"
                    value={formik.values.company_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                    helperText={formik.touched.company_name && formik.errors.company_name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="website">Website</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="website"
                    name="website"
                    type="url"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.website && Boolean(formik.errors.website)}
                    helperText={formik.touched.website && formik.errors.website}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <CustomFormLabel>Gender</CustomFormLabel>
                    <FormControl error={formik.touched.gender && Boolean(formik.errors.gender)}>
                      <RadioGroup
                        row
                        aria-labelledby="gender-label"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                      </RadioGroup>
                      {formik.touched.gender && formik.errors.gender && (
                        <p className="text-red-500">{formik.errors.gender}</p>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="country">Country</CustomFormLabel>
                  <FormControl fullWidth>
                    {/* <InputLabel id="country-label">Select Country</InputLabel> */}
                    <Select
                      labelId="country-label"
                      id="country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.country && Boolean(formik.errors.country)}
                    >
                      {countryCodes?.map((country) => (
                        <MenuItem key={country.code} value={country.name}>
                          {`${country.name} (${country.phone_code})`}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.country && formik.errors.country && (
                      <p className="text-red-500">{formik.errors.country}</p>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="phone_number">Phone Number</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="phone_number"
                    name="phone_number"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                    helperText={formik.touched.phone_number && formik.errors.phone_number}
                  />
                </Grid>
              </Grid>

              <Box>
                <Button
                  sx={{ marginTop: '20px' }}
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ProfileForm;
