import React, { useState } from 'react';
import axios from 'axios';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Grid } from '@mui/material';
import "../Common/header.css";

function Header() {

    return (
        <div className="header-container">
            <Grid container spacing={2} sx={{ flexGrow: 1 }} className="grid-container">
                <Grid xs={6} md={8}>
                    <div className="header-title">ido<strong>Ship</strong></div>
                </Grid>
                <Grid xs={6} md={4} className="profile-section">
                    <CircleNotificationsIcon sx={{ fontSize: 30 }} className="notification-icon" />
                    <div className="profile-icon">VB</div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Header;
