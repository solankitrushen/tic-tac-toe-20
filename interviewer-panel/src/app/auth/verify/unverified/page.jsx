'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Unverified = () => {
  const router = useRouter();

  const handleRegisterClick = () => {
    // Navigate to the registration page
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <img
        src={'/logos/logo.png'}
        alt="unverified"
        className="w-full max-w-md -mb-[30px] -mt-10"
      />
      <h1 className="text-4xl font-bold text-[#e7ddc8] mb-4">Verification Failed</h1>
      <p className="mb-4 text-[#fff] text-lg text-center">
        You are not verified. Please try logging in again to receive a new verification mail.
      </p>
      <button
        onClick={handleRegisterClick}
        className="hover:bg-[#152f1b] text-[#ffffff] rounded-lg bg-[#2A5934] h-12 flex items-center px-[50px] justify-center text-lg mt-2 font-semibold transition duration-300"
      >
        Click for the Login page
      </button>
    </div>
  );
};

export default Unverified;
