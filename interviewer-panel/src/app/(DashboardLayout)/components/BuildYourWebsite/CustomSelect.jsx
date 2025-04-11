import React from "react";
import { styled } from "@mui/material/styles";
import { Select } from "@mui/material";
const CustomSelect = styled((props) => <Select {...props} />)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    color: "#171C23", // Set text color
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.grey[400],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputBase-input": {
    color: "#171C23", // Ensure text is visible
  },
}));

export default CustomSelect;
