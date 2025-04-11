'use client';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { IconLoader, IconSend2 } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

const page = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const fetchEmailData = async () => {
    try {
      const token = Cookies.get('access');

      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      setShowLoader(true);
      setError('');
      const apiKey = await axios.get('/key/generate-api-key/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (apiKey.data.length === 0) {
        toast.error(`Please generate your api keys in My APIs section`);
        return;
      }
      console.log(apiKey.data[0].access_key);
      console.log(apiKey.data[0].secret_key);
      const res = await axios.post('/check/secure_validator/', {
        email,
        access_key: apiKey.data[0].access_key,
        secret_key: apiKey.data[0].secret_key,
      });
      if (res.data) {
        setEmail('');
        setApiResponse(res.data);
        setShowLoader(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) {
        toast.error(`No active subscription found`);
      } else {
        toast.error(`email validation error occured`);
      }
      setShowLoader(false);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="">
      <Toaster />
      <div className="w-full px-4">
        <div className="max-w-full">
          <div className="w-full max-w-2xl space-y-4 mx-auto">
            <Typography variant="h5" fontWeight={900} className="text-left mb-2 mt-5">
              🎉 Try it Now
            </Typography>
            <div className="relative flex justify-center ">
              <TextField
                type="email"
                placeholder="Someone@gmail.com"
                variant="outlined"
                size="medium"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                fullWidth
                className="text-lg rounded-lg border-none  shadow-sm"
              />
              <button
                onClick={fetchEmailData}
                className="bg-blue-500 p-2 rounded-lg ml-4 shadow-sm"
              >
                {showLoader ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  <IconSend2 className="h-6 w-6" />
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            <p className="">
              Please note that using this tool to test an email will consume your credits.
            </p>
          </div>
        </div>
        <div
          className={`bg-black rounded-lg  text-left mt-5 text-[#ffffff] w-full max-w-2xl mx-auto overflow-auto max-h-[300px] sm:max-h-[400px] ${
            apiResponse ? 'block' : 'hidden'
          }`}
        >
          {apiResponse ? (
            <SyntaxHighlighter
              language="json"
              style={a11yDark}
              customStyle={{
                background: 'transparent',
                // padding: "10px",
                whiteSpace: 'pre-wrap', // Wrap long lines
                wordBreak: 'break-word', // Break long words if necessary
              }}
              wrapLines={true}
            >
              {JSON.stringify(apiResponse, null, 2)}
            </SyntaxHighlighter>
          ) : (
            <p>/* Result will be displayed here... */</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
