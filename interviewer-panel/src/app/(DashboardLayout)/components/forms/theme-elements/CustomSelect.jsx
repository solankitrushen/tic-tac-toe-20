'use client';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Select } from '@mui/material';

const CustomSelect = styled((props) => <Select {...props} />)(({}) => ({}));

export default CustomSelect;
