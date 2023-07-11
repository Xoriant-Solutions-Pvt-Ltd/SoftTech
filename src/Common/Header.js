import React, { useState } from 'react';
import axios from 'axios';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Grid } from '@mui/material';

function Header() {

    return (
        <div style={{ padding: "25px 25px 10px 25px", boxShadow: "0 1px lightGrey" }}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }} style={{ display: "flex", alignItems: "center" }}>
                <Grid xs={6} md={8}>
                    <div style={{ fontSize: "1.5rem", color: "darkblue" }}>ido<strong>Ship</strong></div>
                </Grid>
                <Grid xs={6} md={4} style={{ display: "flex", justifyContent: "right", gap: "20px", alignItems: "center" }}>
                    <CircleNotificationsIcon sx={{ fontSize: 30 }} style={{ color: "lightgrey" }} />
                    <div style={{ padding: "10px", borderRadius: "20px", border: "1px solid lightGrey", background: "darkblue", color: "white" }}>VB</div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Header;
