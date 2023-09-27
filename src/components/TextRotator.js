import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';


const TextRotator = () => {
  const [currentText, setCurrentText] = useState('adventure');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText(prevText => {
        switch (prevText) {
          case 'adventure':
            return 'roadtrip';
          case 'roadtrip':
            return 'vacation';
          case 'vacation':
            return 'spring break';
          case 'spring break':
            return 'adventure';
          default:
            return 'adventure';
        }
      });
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Typography style={{fontSize:'50px', color:'white', fontWeight:'bold' ,paddingTop:'90px'}}>
      Your <u>{currentText}</u> starts here.
    </Typography>
  );
}

export default TextRotator;
