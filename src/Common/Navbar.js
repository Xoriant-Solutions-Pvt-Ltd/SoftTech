import React, { useState } from 'react';
import axios from 'axios';
import WindowIcon from '@mui/icons-material/Window';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import { Grid, Link } from '@mui/material';
import '../Common/navbar.css';

function Navbar() {

    const [selectedMenu, setSelectedMenu] = useState("Dashboard");

    const handleOnMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    return (
        <div style={{ border: "1px solid lightgrey", padding: "16px", height: "90vh" }}>
            <Grid container>
                <Grid xs={8} md={1}>
                    <Link underline="none" className="menu-link" to={"/"}><WindowIcon onClick={() => handleOnMenuClick("Dashboard")} sx={{ fontSize: 40 }} style={{ padding: "10px", color: selectedMenu === "Dashboard" ? "darkblue" : "darkgrey" }} /></Link>
                    <Link underline="none" className="menu-link" to={"/cart"}><ShoppingCartIcon onClick={() => handleOnMenuClick("Cart")} sx={{ fontSize: 40 }} style={{ padding: "10px", color: selectedMenu === "Cart" ? "darkblue" : "darkgrey" }} /></Link>
                    <Link underline="none" className="menu-link" to={"/offers"}><LocalOfferIcon onClick={() => handleOnMenuClick("Offer")} sx={{ fontSize: 40 }} style={{ padding: "10px", color: selectedMenu === "Offer" ? "darkblue" : "darkgrey" }} /></Link>
                    <Link underline="none" className="menu-link" to={"/group"}><GroupIcon onClick={() => handleOnMenuClick("Group")} sx={{ fontSize: 40 }} style={{ padding: "10px", color: selectedMenu === "Group" ? "darkblue" : "darkgrey" }} /></Link>
                    <Link underline="none" className="menu-link" to={"/business"}><StoreIcon onClick={() => handleOnMenuClick("Business")} sx={{ fontSize: 40 }} style={{ padding: "10px", color: selectedMenu === "Business" ? "darkblue" : "darkgrey" }} /></Link>
                </Grid>
            </Grid>
        </div>
    );
}

export default Navbar;
