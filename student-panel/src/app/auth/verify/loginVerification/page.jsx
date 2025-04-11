'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const LoginVerification = () => {
  const router = useRouter();

  const gotomail = async () => {
    try {
      window.open('https://mail.google.com/', '_blank');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error navigating to /mail:', error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <div className=" mx-auto w-[250px] md:w-[300px] xl:w-[400px] ">
        <img
          src={'/images/svgs/loginverfication.svg'}
          alt="unverified"
          className="w-full max-w-md -mt-8"
        />
      </div>
      <div className=" text-center mx-3 ">
        <p className=" text-2xl md:text-3xl xl:text-4xl  font-bold 2xl:font-extrabold  text-[#d4cab5] mb-2 md:mb-4 xl:mb-5 2xl:mb-7">
          Your Verification is Pending.
        </p>
        <div className=" text-[#fff] text-[17px] md:text-[19px] xl:text-[23px]  2xl:font-bold font-medium -mt-[10px]">
          <p className="my-1 xl:my-2">
            Please check your mail to complete our Verification process.
          </p>
        </div>
      </div>
      <div>
        <button
          className="hover:bg-[#152f1b] text-[#ffffff] rounded-lg bg-[#2A5934] p-3  text-xl xl:text-2xl  font-semibold my-3 "
          onClick={gotomail}
        >
          Open Gmail
        </button>
      </div>
    </div>

    // <div className="flex justify-center items-center h-screen">
    /* <div>
        <h1 className="text-[100px]">Verification Page</h1>
        <p>{verificationMessage}</p>
      </div>

      <div>
        <button
          className="h-[50px] w-[150px] my-10 bg-[#004aad] text-[#ffffff] rounded flex items-center"
        >
          Click me to verify
        </button>
      </div> */
  );
};

export default LoginVerification;
