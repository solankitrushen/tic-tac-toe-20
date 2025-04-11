'use client';
import { Container, FormControl, InputLabel } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import CreateWithAiModal from './CreateWithAiModal';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomSelect from '../components/BuildYourWebsite/CustomSelect';
import { MultiStepLoader } from './MultiStepLoader';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useSession } from 'next-auth/react';
import PageContainer from '../components/container/PageContainer';
function StepperForm() {
  const steps = [
    'website Type',
    'Business Name',
    'Upload Logo',
    'Upload Project Banner',
    'Business Description',
  ]; // Updated steps array
  const options = [
    { value: 'business', label: 'Business' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'blog', label: 'Blog' },
    { value: 'ecommerce', label: 'Ecommerce' },
  ];
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentState, setCurrentState] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [formValues, setFormValues] = useState({
    websiteType: '',
    businessDescription: '',
    businessName: '',
    logo: null, // State to hold the uploaded logo
    projectBanner: null, // State to hold the uploaded logo
  });
  const [previewImage, setPreviewImage] = useState(null); // State to preview image
  const [projectBannerPreviewImage, setProjectBannerPreviewImage] = useState(null); // State to preview image
  const [showStepLoader, setShowStepLoader] = useState(false); // State to preview image
  const fileInputRef = useRef(null); // Reference for file input element

  const { data: session } = useSession();
  console.log('session', session);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormValues({
      websiteType: '',
      businessDescription: '',
      businessName: '',
      logo: null,
      projectBanner: null,
    });
    setPreviewImage(null);
    setProjectBannerPreviewImage(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormValues((prevValues) => ({
        ...prevValues,
        logo: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChangeForProjectBanner = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormValues((prevValues) => ({
        ...prevValues,
        projectBanner: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectBannerPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFormValues((prevValues) => ({
        ...prevValues,
        logo: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDropProjectBanner = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFormValues((prevValues) => ({
        ...prevValues,
        projectBanner: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectBannerPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const renderFormContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#4936D5' }}>
              Type of your business
            </Typography>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#000000' }}>
                What type of business are you building?
              </InputLabel>
              <CustomSelect
                value={formValues.websiteType}
                name="websiteType"
                onChange={handleChange}
                label="What type of business are you building?"
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#4936D5' }}>
                Name of your business
              </Typography>
              <TextField
                label="What is the name of your Business?"
                value={formValues.businessName}
                name="businessName"
                onChange={handleChange}
                InputProps={{
                  sx: {
                    color: 'black',
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent', // Ensure transparent background
                      WebkitBoxShadow: 'none', // Remove any webkit box shadow
                      WebkitTextFillColor: 'initial', // Use initial text fill color
                    },
                  },
                }}
                fullWidth
              />
            </Box>
          </>
        );
      case 2:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#4936D5' }}>
              Upload Your Logo
            </Typography>
            <Button
              variant="h6"
              sx={{ mb: 2, color: '#4936D5' }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Create with AI
            </Button>
            {showModal && <CreateWithAiModal showModal={showModal} setShowModal={setShowModal} />}
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                border: '2px dashed #ccc',
                borderRadius: 4,
                padding: 2,
                textAlign: 'center',
                cursor: 'pointer',
                // backgroundColor: "#13DEB9",

                marginBottom: 2,
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                type="file"
                accept=".ico"
                ref={fileInputRef}
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Logo Preview"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                />
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#4936D5' }} />
                  <Typography variant="subtitle1" sx={{ color: '#4936D5' }}>
                    Drag & Drop or Click to Upload
                  </Typography>
                </Box>
              )}
            </Box>
            {formValues.logo && (
              <Typography sx={{ color: 'black' }}>File Selected: {formValues.logo.name}</Typography>
            )}
          </Box>
        );
      case 3:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#4936D5' }}>
              Upload Your Project Banner
            </Typography>
            <Button
              variant="h6"
              sx={{ mb: 2, color: '#4936D5' }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Create with AI
            </Button>
            {showModal && <CreateWithAiModal showModal={showModal} setShowModal={setShowModal} />}
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                border: '2px dashed #ccc',
                borderRadius: 4,
                padding: 2,
                textAlign: 'center',
                cursor: 'pointer',
                // backgroundColor: "#13DEB9",

                marginBottom: 2,
              }}
              onDragOver={handleDragOver}
              onDrop={handleDropProjectBanner}
              onClick={openFileDialog}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoChangeForProjectBanner}
                style={{ display: 'none' }}
              />
              {projectBannerPreviewImage ? (
                <img
                  src={projectBannerPreviewImage}
                  alt="Logo Preview"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                />
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#4936D5' }} />
                  <Typography variant="subtitle1" sx={{ color: '#4936D5' }}>
                    Drag & Drop or Click to Upload
                  </Typography>
                </Box>
              )}
            </Box>
            {formValues.projectBanner && (
              <Typography sx={{ color: 'black' }}>
                File Selected: {formValues.projectBanner.name}
              </Typography>
            )}
          </Box>
        );

      case 4:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#4936D5' }}>
              Description of your business
            </Typography>
            <TextField
              label="Enter your Business description"
              value={formValues.businessDescription}
              name="businessDescription"
              onChange={handleChange}
              InputProps={{
                sx: {
                  color: 'black',
                  padding: '0', // Set padding to 0 to remove it
                },
              }}
              multiline
              rows={4} // Adjust the number of rows as needed
              fullWidth
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const createProject = async (data) => {
    try {
      console.log('create Project data', data);
      const res = await axios.post(`/project/userId/${data.userId}`, data);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      setShowStepLoader(false); // Hide loader on error
      toast.error('error creating project');

      return error;
    }
  };

  const createSubdomain = async (data) => {
    try {
      console.log('subdomain data', data);
      const res = await axios.post('/wp/create-subdomain', data);
      console.log(res.data);
      const urlMatch = res.data.message.match(/https?:\/\/[^\s]+/);
      console.log('urlMatch', urlMatch[0]);

      localStorage.setItem('subdomain', urlMatch[0]);
      return urlMatch[0];
    } catch (error) {
      console.log(error);
      toast.error('error creating subdomain (domain exist)');
      setShowStepLoader(false); // Hide loader on error

      return error;
    }
  };

  const installWordpress = async (data) => {
    try {
      const res = await axios.post('/wp/install', data);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error('error installing wordpress');

      setShowStepLoader(false); // Hide loader on error

      return error;
    }
  };
  const installTheme = async (data) => {
    const params = new URLSearchParams();
    params.append('subdomain', data.subdomain);
    params.append('site_name', data.site_name);
    params.append('site_desc', data.site_desc);
    params.append('admin_email', data.admin_email);

    fetch('https://newebai.com/final_wpapi.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set content type to form-encoded
      },
      body: params.toString(), // Convert params to URL-encoded string
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('error installing Theme');

        setShowStepLoader(false); // Hide loader on error
        return error;
      });
  };

  const generateContent = async (data) => {
    try {
      const res = await axios.post('/wp/generate/content', data);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error('error generating content');

      setShowStepLoader(false); // Hide loader on error
      return error;
    }
  };

  //  Helper function to convert File/Blob to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadLogo = async (file) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      console.log('Uploading logo...');

      // Make an API request to upload the file to S3 (or the relevant service)
      const res = await axios.post(`/project/uploadLogoToS3`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This is required when using FormData
        },
      });

      console.log('Upload response:', res.data.imageUrl);
      toast.success('Logo uploaded successfully');

      return res.data.imageUrl;
    } catch (error) {
      console.log('Error uploading logo:', error);
      toast.error('Error uploading logo');
      return error;
    }
  };

  const uploadProjectBanner = async (file) => {
    try {
      const formData = new FormData();
      formData.append('projectCover', file);

      console.log('Uploading logo...');

      // Make an API request to upload the file to S3 (or the relevant service)
      const res = await axios.post(`/project/uploadBannerTos3`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This is required when using FormData
        },
      });

      console.log('Upload response:', res.data.imageUrl);
      toast.success('Logo uploaded successfully');

      return res.data.imageUrl;
    } catch (error) {
      console.log('Error uploading logo:', error);
      toast.error('Error uploading logo');
      return error;
    }
  };

  const generateWebsite = async () => {
    try {
      // Show the loader and set it to the initial state
      setShowStepLoader(true);
      setCurrentState(0);

      const parsedUserData = JSON.parse(localStorage.getItem('userData'));
      const parsedFormValues = JSON.parse(localStorage.getItem('formValues'));

      console.log('parsedUserData', parsedUserData);
      console.log('formValues', parsedFormValues);

      // Step 1: Create subdomain
      let subdomainURL;
      try {
        subdomainURL = await createSubdomain({
          subdomain: parsedFormValues.businessName,
          admin_email: parsedUserData.email,
        });
        if (!subdomainURL) throw new Error('Subdomain URL is invalid'); // Validate response
      } catch (error) {
        console.error('Error creating subdomain:', error);
        throw new Error('Subdomain creation failed');
      }
      setCurrentState(1); // Move to the next step after subdomain creation is successful

      let imgUrl, bannerUrl;
      try {
        imgUrl = await uploadLogo(formValues.logo);
        bannerUrl = await uploadProjectBanner(formValues.projectBanner);
      } catch (error) {
        console.error('Error uploading img:', error);
        throw new Error('uploading img  failed');
      }

      // Step 2: Create project
      let projectCreation;
      try {
        projectCreation = await createProject({
          projectId: uuid(),
          projectName: parsedFormValues.businessName,
          projectDomain: subdomainURL,
          userId: parsedUserData._id,
          projectSummary: parsedFormValues.businessDescription,
          projectDescription: parsedFormValues.businessDescription,
          siteType: parsedFormValues.websiteType,
          projectLogo: imgUrl,
          projectCover: bannerUrl,
        });
        if (!projectCreation) throw new Error('Project creation failed'); // Validate response
      } catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Project creation failed');
      }
      setCurrentState(2); // Move to the next step after project creation is successful

      // Step 3: Install WordPress
      let installWordpressRes;
      try {
        installWordpressRes = await installWordpress({
          subdomain: parsedFormValues.businessName,
          site_name: parsedFormValues.businessName,
          site_desc: parsedFormValues.businessDescription,
          username: parsedUserData.fullName,
          admin_email: parsedUserData.email,
        });
        if (!installWordpressRes) throw new Error('WordPress installation failed'); // Validate response
      } catch (error) {
        console.error('Error installing WordPress:', error);
        throw new Error('WordPress installation failed');
      }
      setCurrentState(3); // Move to the next step after WordPress installation is successful

      // Step 4: Install theme
      let installThemeRes;
      try {
        installThemeRes = await installTheme({
          subdomain: subdomainURL,
          site_name: parsedFormValues.businessName,
          site_desc: parsedFormValues.businessDescription,
          admin_email: parsedUserData.email,
        });
        if (!installThemeRes) throw new Error('Theme installation failed'); // Validate response
      } catch (error) {
        console.error('Error installing theme:', error);
        throw new Error('Theme installation failed');
      }
      setCurrentState(4); // Move to the next step after theme installation is successful

      // Step 5: Generate content
      let generateContentRes;
      try {
        generateContentRes = await generateContent({
          prompt: parsedFormValues.businessDescription,
        });
        if (!generateContentRes) throw new Error('Content generation failed'); // Validate response
      } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Content generation failed');
      }
      setCurrentState(5); // Final step after content generation is successful

      // Check if everything is successful and hide the loader
      setShowStepLoader(false);
      return { status: 200, message: 'Website generated successfully', subdomainURL };
    } catch (error) {
      console.log('Error during website generation:', error);
      setShowStepLoader(false); // Hide loader on error
      return { status: 400, message: 'Website generation failed', error: error.message };
    }
  };

  const handleGenerateWebsite = async () => {
    try {
      console.log('Form Values:', formValues);
      const logoBase64 = await convertToBase64(formValues.logo);
      const projectBannerBase64 = await convertToBase64(formValues.projectBanner);

      // Create a new object with Base64 logo
      const formValuesToStore = {
        ...formValues,
        logo: logoBase64, // Store logo as base64
        projectBanner: projectBannerBase64, // Store logo as base64
      };

      localStorage.setItem('formValues', JSON.stringify(formValuesToStore));

      const res = await generateWebsite();
      if (res.status === 200) {
        router.push('/website');
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log('Error during website generation flow:', error);
    }
  };

  const loadingStates = [
    { text: 'Step 1: Creating subdomain...' },
    { text: 'Step 2: Creating Project...' },
    { text: 'Step 3: Installing Wordpress...' },
    { text: 'Step 3: Installing theme...' },
    { text: 'Step 3: Generating content...' },
    { text: 'Step 3: Finalizing website...' },
  ];

  return (
    <>
      <PageContainer title="Build your Website" description="this is Build your Website page">
        <Toaster />
        {showStepLoader && (
          <MultiStepLoader
            loadingStates={loadingStates}
            loading={showStepLoader}
            duration={4 * 60 * 60}
            currentState={currentState}
            loop={true}
          />
        )}

        <div className=" overflow-hidden p-5 ">
          <Container
            maxWidth="xl"
            style={{ overflow: 'hidden' }}
            className=""
            //   sx={{ paddingTop: '80px' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                width: '100%',
              }}
            >
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: 'white',
                    fontSize: { xs: '0.85rem', sm: '1rem', md: '1.05rem' }, // Responsive font size
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, // Responsive icon size
                  },
                  width: '100%',
                }}
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {
                    sx: { color: 'black' },
                  };

                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // minHeight: "50vh",
                // padding: 3,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  backgroundColor: '#2c2c2c',
                  borderRadius: 2,
                  padding: 4,
                  boxShadow: 3,
                  marginTop: 2,
                  bgcolor: 'white',
                }}
              >
                <Typography
                  variant="h3"
                  display={'flex'}
                  justifyContent={'center'}
                  sx={{ mb: 2, color: 'black' }}
                >
                  Step {activeStep + 1}
                </Typography>
                {renderFormContent(activeStep)}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1, color: '#4936D5' }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button
                        onClick={handleGenerateWebsite}
                        sx={{
                          backgroundColor: '#3f51b5',
                          color: 'white',
                          '&:hover': { backgroundColor: '#303f9f' },
                        }}
                        disabled={
                          (activeStep === 0 && !formValues.websiteType) ||
                          (activeStep === 1 && !formValues.businessName) ||
                          (activeStep === 2 && !formValues.logo) ||
                          (activeStep === 3 && !formValues.projectBanner) ||
                          (activeStep === 4 && !formValues.businessDescription)
                        }
                      >
                        Generate Website
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1, color: '#4936D5' }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Button
                          onClick={handleNext}
                          // color="inherit"
                          variant="outlined"
                          sx={{
                            mr: 1,
                            color: '#4936D5',

                            display: `${activeStep === 2 ? 'block' : 'none'}`,
                          }}
                        >
                          Skip
                        </Button>
                        <Button
                          onClick={handleNext}
                          sx={{
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                            '&:hover': {
                              backgroundColor: '#303f9f',
                              boxShadow: '0 3px 5px 2px rgba(48, 63, 159, .3)',
                            },
                            '&:disabled': {
                              backgroundColor: '#9ea7cf',
                              color: '#cfd4ea',
                              boxShadow: 'none',
                            },
                          }}
                          disabled={
                            (activeStep === 0 && !formValues.websiteType) ||
                            (activeStep === 1 && !formValues.businessName) ||
                            (activeStep === 2 && !formValues.logo) ||
                            (activeStep === 3 && !formValues.projectBanner) ||
                            (activeStep === 4 && !formValues.businessDescription)
                          }
                        >
                          Next
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              {activeStep === steps.length && (
                <Typography sx={{ mt: 2, mb: 1, color: 'white' }}>
                  All steps completed - you're finished
                </Typography>
              )}
              {activeStep === steps.length && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset} sx={{ color: 'white' }}>
                    Reset
                  </Button>
                </Box>
              )}
            </Box>
            {/* <Boxes /> */}
          </Container>
        </div>
      </PageContainer>
    </>
  );
}

export default StepperForm;
