import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LandMarkImage from '../../assets/BRU.jpeg';
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

export default function Attractions({data}) {
    return (

        <Item sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%', margin: '0 auto', marginTop: '3%' }}>
            <CardMedia
                sx={{ height: 140 , flex: '0 0 40%'  }}
                image={LandMarkImage}
                title="LandMarkImage"
            />
            <CardContent sx={{ flex: '1' }}>
                <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={12} sx={{fontWeight:'bold', fontSize:'1rem'}}>
                <a href={data.link} target="_blank" rel="noopener noreferrer" 
        style={{ textDecoration: 'none', color: 'inherit' }}
        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
        {data.name}
    </a>
                    </Grid>
                    <Grid item xs={12} sx={{color:'grey'}}>
                       {data.cuisine}
                    </Grid>
                    <Grid item xs={12} sx={{color:'grey'}}>
                        {data.rating} <StarRateIcon sx={{verticalAlign:'text-bottom', color:'gold'}}></StarRateIcon> ({data.reviews})
                    </Grid>
                    <Grid item xs={12} sx={{fontWeight:'bold'}}>
                      {data.price}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', flex: '0 0 5%' }}>
            <Checkbox  {...label} icon={<AddLocationAltOutlinedIcon></AddLocationAltOutlinedIcon>} checkedIcon={<AddLocationAltIcon></AddLocationAltIcon>} />
            </CardActions>
        </Item>
    );
}
