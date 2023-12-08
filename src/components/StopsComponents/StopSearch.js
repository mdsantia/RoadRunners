import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function StopSearch({ data, onSelectedAttractionsChange }) {
  const [selectedValues, setSelectedValues] = React.useState([]);

  if (!Array.isArray(data) || data.length === 0) {
    // Return a message or handle empty data case
    return <p>No data available</p>;
  }

  const isValidOption = (option) => option && option.name;

  return (
    <div>
     <Autocomplete
      multiple
      id="tags-outlined"
      options={data}
      getOptionLabel={(option) => isValidOption(option) ? option.name : ''}
      value={selectedValues}
      onChange={(event, newValue) => {
        setSelectedValues(newValue);
        // Call the callback function to update selectedAttractions in the parent component
        onSelectedAttractionsChange(newValue);
      }}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label="Add Attractions"
          placeholder=""
        />
      )}
    />
    
    </div>
  );
}
