import React from 'react';
import Header from './header';
import Footer from './footer';
import Grid from '@mui/material/Unstable_Grid2';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Grid container spacing={2}>
        <Grid 
          xs={6}
          sx={{
            // display: 'flex',
            // flexDirection: 'column'
          }}>
          <Item
            sx={{ 
              height: '400px' 
            }}
          >{children[0]}</Item>
        </Grid>
        <Grid xs={6}>
          <Item
            sx={{ 
              height: '400px',
              textAlign: 'left'
            }}>
            {children[1]}
          </Item>
        </Grid>
        <Grid xs={12}>
          <Item
            sx={{ height: '200px' }}>
            {children[2]}
          </Item>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',

  color: theme.palette.text.secondary,
}));