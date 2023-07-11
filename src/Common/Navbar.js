import React, { useState } from 'react';
import axios from 'axios';
import WindowIcon from '@mui/icons-material/Window';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import '../Common/navbar.css';
import { Grid } from '@mui/material';

function Navbar() {

    return (
        <div style={{ border: "1px solid lightgrey", padding: "16px", height: "90vh" }}>
            <Grid container>
                <Grid xs={8} md={1}>
                    <WindowIcon sx={{ fontSize: 40 }} style={{ padding: "10px", color: "darkgrey" }} />
                    <ShoppingCartIcon sx={{ fontSize: 40 }} style={{ padding: "10px", color: "darkgrey" }} />
                    <LocalOfferIcon sx={{ fontSize: 40 }} style={{ padding: "10px", color: "darkgrey" }} />
                    <GroupIcon sx={{ fontSize: 40 }} style={{ padding: "10px", color: "darkgrey" }} />
                    <StoreIcon sx={{ fontSize: 40 }} style={{ padding: "10px", color: "darkgrey" }} />
                </Grid>
            </Grid>
        </div>
    );
}

export default Navbar;
