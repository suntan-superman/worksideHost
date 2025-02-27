import React from 'react';
import { Button } from '@mui/material';

const LoginButton = ({ onClick }) => {
  return (
    <Button 
      variant="contained" 
      onClick={onClick}
      color="primary"
      sx={{
        '&:hover': {
          backgroundColor: 'primary.dark'
        }
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton; 