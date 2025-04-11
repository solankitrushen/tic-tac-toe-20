import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function CreateWithAiModal({ setShowModal, showModal }) {
  const [open, setOpen] = useState(showModal);

  const handleClose = () => {
    setOpen(false);
    setShowModal(false);
  };

  return (
    <Dialog maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>Coming Soon!</DialogTitle>
      <DialogContent>
        <div>This feature is currently under development.</div>
        <div>Stay tuned for updates!</div>
      </DialogContent>
      <DialogActions sx={{ padding: "5px" }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateWithAiModal;
