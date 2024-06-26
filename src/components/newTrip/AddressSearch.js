import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, Typography } from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { useEffect } from 'react';
import { GOOGLE_MAPS_API_KEY } from '../../Constants';
import { useDashboardContext } from '../../context/DashboardContext';

function loadScript(src, position, id, onLoad) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.setAttribute('id', id);
  script.src = src;

  if (onLoad && typeof onLoad === 'function') {
    script.onload = onLoad;
  }

  position.appendChild(script);

  return () => {
    // Remove the script when the component unmounts
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}

export default function AddressSearch({label, onInputChange }) {
  const {tripDetails} = useDashboardContext();
  const scripts = document.getElementsByTagName('script');
  const [value, setValue] = React.useState(tripDetails ? (label === "Start Location" ? tripDetails.startLocation : tripDetails.endLocation) : null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  useEffect(() => {
    if (tripDetails) {
      setValue(label === "Start Location" ? tripDetails.startLocation : tripDetails.endLocation);
    }
  }, [tripDetails]);

  const handleInputChange = (newInputValue) => {
    if (newInputValue !== null) {
      onInputChange(newInputValue.description);
    }
  };

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        if (window.google && window.google.maps.places) {
          const autocompleteService = new window.google.maps.places.AutocompleteService();
          autocompleteService.getPlacePredictions(request, callback);
        }
      }, 400),
    []
  );

  React.useEffect(() => {
    if (!window.google && !loaded.current && !scripts.googlemaps) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'googlemaps',
        () => {
          loaded.current = true;
        }
      );
    }
  }, []);

  return (
    <Autocomplete
      id="google-map-demo"
      sx={{ minWidth: '25%' }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        handleInputChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        fetch({ input: newInputValue }, (results) => {
          let newOptions = [];

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        });
      }}
      renderInput={(params) => <TextField {...params} label={label} fullWidth />}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
