import React from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';



const StyledCard = styled(Card)({
  width: 800,
  margin: 'auto',
  padding: 14,
  marginTop: 30,
  textAlign: 'center',
  borderRadius: 40,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});


export default function HomePage() {

  return (
    <StyledCard>
      <TextField id="standard-basic" label="Starting Location" variant="standard" />
      <TextField id="standard-basic" label="Start Date" variant="standard" />
      <TextField id="standard-basic" label="End Date" variant="standard" />
      <TextField id="standard-basic" label="Destination" variant="standard" />
      <Fab aria-label="delete" style={{ marginTop: '10px', marginLeft: '20px', backgroundColor: 'red', color: 'white' }}>
        <SearchIcon />
      </Fab>
    </StyledCard>
  );
}
