import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function StopSearch({data}) {
  return (
      <Autocomplete
        multiple
        id="tags-outlined"
        options={data}
        getOptionLabel={(option) => option.name}
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

