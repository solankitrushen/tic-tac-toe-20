'use client';
import React, { useEffect, useState } from 'react';
import DashboardCard from '../components/shared/DashboardCard';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment-timezone';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

const Page = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [showKeys, setShowKeys] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleKeys = () => {
    setShowKeys((prev) => !prev);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch((error) => {
        toast.error('Failed to copy!');
        console.error('Failed to copy text: ', error);
      });
  };

  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true);
      const token = Cookies.get('access');

      try {
        const res = await axios.get('/key/generate-api-key/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Ensure this API returns consistent data
        if (res.status === 200) {
          if (res.data.length === 0) {
            const apiKeyRes = await axios.post(
              '/key/generate-api-key/',
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log(apiKeyRes.data);
            setApiKeys(apiKeyRes.data);
          } else {
            setApiKeys(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApiKeys();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <DashboardCard title="My APIs">
      <Toaster />
      <TableContainer>
        <Table aria-label="My APIs" sx={{ whiteSpace: 'nowrap' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Id
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Access Key
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Secret Key
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Created Date
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiKeys?.map((key) => (
              <TableRow key={key.id}>
                <TableCell sx={{ pl: 0 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {key.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {key.access_key}
                  </Typography>
                </TableCell>
                <TableCell>
                  <>
                    <div
                      style={{ display: 'flex', alignItems: 'center' }}
                      className="relative flex"
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        className={showKeys ? '' : 'blur pointer-events-none'} // Add blur class conditionally
                        onClick={() => showKeys && copyToClipboard(key.secret_key)} // Copy to clipboard
                        style={{ cursor: showKeys ? 'pointer' : 'default', marginRight: '8px' }} // Change cursor when keys are visible
                      >
                        {key.secret_key}
                      </Typography>
                      {!showKeys && (
                        <Button
                          onClick={toggleKeys} // Toggle the visibility of the keys
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', zIndex: '10' }}
                        >
                          Reveal
                        </Button>
                      )}
                    </div>
                    {showKeys && (
                      <div className="mt-2">
                        <Button
                          onClick={toggleKeys} // Toggle the visibility of the keys
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', zIndex: '10' }}
                        >
                          Hide
                        </Button>
                      </div>
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {moment(key.created_at).tz('Asia/Kolkata').format('MMMM D, YYYY')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default Page;
