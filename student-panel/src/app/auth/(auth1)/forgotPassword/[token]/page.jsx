'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';
const LinkAuthentication = () => {
  const router = useRouter();
  const { token } = useParams();
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(true);

  return (
    <>
      <ChangePasswordModal
        open={showPasswordUpdateModal}
        handleClose={() => setShowPasswordUpdateModal(false)}
        email_token={token}
      />
    </>
  );
};

export default LinkAuthentication;
