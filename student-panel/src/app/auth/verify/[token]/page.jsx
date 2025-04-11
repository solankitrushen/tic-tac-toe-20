'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const LinkAuthentication = () => {
  const router = useRouter();
  const { token } = useParams();
  const [verificationMessage, setVerificationMessage] = useState('');
  console.log('token form ', token);
  const verifyLink = async () => {
    try {
      const response = await axios.get(`/auth/verify/${token}`);
      console.log('user TOKEN', response);
      setVerificationMessage(response.data);
      if (response.status === 200) {
        toast.success('Verification successful');
        router.push('/auth/login');
      }
    } catch (error) {
      setVerificationMessage('Error verifying link');
      toast.error('Error verifying link');
      router.push('/auth/verify/unverified');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex justify-center items-center">
          <img src={'/logos/logo.png'} className="w-[400px] -mt-[110px]" alt="Verification" />
        </div>
        <div className="flex flex-col items-center text-center leading-6">
          <h1 className="text-4xl text-[#c8bea7] font-bold mt-4 ">
            Thank you for verifying your email address!
          </h1>
          <p className="mt-4 text-[#fff] text-[30px] leading-8">
            We're thrilled to have you on board! To complete the verification process,
          </p>
          <p className="mt-4 text-[#fff] text-[30px] leading-8"> Please click the button below.</p>
          <div className="hover:bg-[#152f1b] text-[#ffffff] rounded-lg bg-[#2A5934] h-[60px] w-[300px] flex items-center justify-center text-[30px] mt-8 font-semibold transition duration-300">
            <button onClick={verifyLink}>Verify To Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAuthentication;
