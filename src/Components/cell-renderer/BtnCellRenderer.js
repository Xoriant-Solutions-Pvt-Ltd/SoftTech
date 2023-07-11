import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button } from '@mui/material';

function BtnCellRenderer(props) {

    const btnClickedHandler = (event) => {
        props.clicked(event, props.value);
    }

	return (
		<div>
			<Button variant="contained" style={{ background: "lightGrey", color: "black", height: "22px", width: "40px" }}
            onClick={btnClickedHandler}><MoreHorizIcon /></Button>
		</div>
	);
}

export default BtnCellRenderer;
