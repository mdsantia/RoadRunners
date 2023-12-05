import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Discard Unsaved Changes?</DialogTitle>
      <DialogActions>
        <Button 
            onClick={onClose} 
            style={{ color: 'darkblue', borderColor: 'darkblue', borderRadius: '20px' }}
            autoFocus
        >
          Cancel
        </Button>
        <Button 
            onClick={onConfirm} 
            style={{ color: 'darkblue', borderColor: 'darkblue', borderRadius: '20px' }}
            autoFocus
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;