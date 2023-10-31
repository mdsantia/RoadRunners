import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LandMarkImage from '../../assets/FHV-image.jpeg';
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

export default function HotelCard({data}) {
    return (

        <Card sx={{maxWidth: 300 , marginTop:'3%'}}>
            <CardMedia
                sx={{ height: 140 }}
                image={LandMarkImage}
                title="LandMarkImage"
            />
            <CardContent>
                <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item md={12} sx={{fontWeight:'bold', fontSize:'1.4rem'}}>
                        {data.name} 
                    </Grid>
                    <Grid item xs={8}>
                        {data.rating} <StarRateIcon sx={{verticalAlign:'text-bottom', color:'gold'}}></StarRateIcon> ({data.reviews})
                    </Grid>
                    <Grid item xs={8} sx={{fontWeight:'bold'}}>
                      ${data.price}/night
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
            <Checkbox  {...label} icon={<AddLocationAltOutlinedIcon></AddLocationAltOutlinedIcon>} checkedIcon={<AddLocationAltIcon></AddLocationAltIcon>} />
            </CardActions>
        </Card>
    );
}
