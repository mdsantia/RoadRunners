import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LandMarkImage from '../../assets/exxon.png';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import StarRateIcon from '@mui/icons-material/StarRate';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const handleClick = (name) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(name)}`;
    window.open(searchUrl, '_blank');
};

function convertPrice(price) {
    let priceLevel = '';
    if (price === 0) {
        return 'Free';
    }
    for (let i = 0; i < price; i++) {
        priceLevel += '$';
    }
    return priceLevel;
}

export default function GasStations({data, selected, onSelectionChange, viewOnly}) {
    return (

        <Item sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%', margin: '0 auto', marginTop: '3%' }}>
          
            <CardContent sx={{ flex: '1' }}>
                <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={12} sx={{fontWeight:'bold', fontSize:'1.2rem'}}>
                <a
                            href="#"
                            onClick={() => handleClick(data.name)}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            {data.name}
                        </a>
                    </Grid>
                    <Grid item xs={12} >
                    <StarRateIcon sx={{verticalAlign:'text-bottom', color:'gold'}}></StarRateIcon>({data.rating})
                        {/* {data.rating}   ({data.reviews}) */} {data.vicinity}
                    </Grid>   
                    <Grid item xs={12} sx={{fontWeight:'bold'}}>
                        {`Regular: $${data.price.Regular || 'N/A'}  | MidGrade: $${data.price.MidGrade || 'N/A'}`}
                        <br/> 
                        {`Premium: $${data.price.Premium || 'N/A'}  | Diesel: $${data.price.Diesel || 'N/A'}`}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', flex: '0 0 5%' }}>
     
            <Checkbox
          {...label}
          icon={<AddLocationAltOutlinedIcon />}
          checkedIcon={<AddLocationAltIcon />}
          checked={selected} 
          onChange={onSelectionChange} 
          disabled={viewOnly}
        />
            
            </CardActions>
        </Item>
    );
}
