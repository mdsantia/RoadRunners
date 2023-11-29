import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function StopSearch({data}) {
  if (!Array.isArray(data) || data.length === 0) {
    // Return a message or handle empty data case
    return <p>No data available</p>;
  }

  const isValidOption = (option) => option && option.name;

  
  return (
      <Autocomplete
        multiple
        id="tags-outlined"
        options={data}
        getOptionLabel={(option) => isValidOption(option) ? option.name : ''}
        defaultValue={[data[13]]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Attractions"
            placeholder=""
          />
        )}
      />
  );
}

