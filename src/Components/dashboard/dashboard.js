import { Button, Grid, InputLabel, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState, MouseEvent, HTMLButtonElement } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import BtnCellRenderer from '../cell-renderer/BtnCellRenderer';

function Dashboard() {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `newProduct`;
        navigate(path);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [anchorElAction, setAnchorElAction] = useState(null);

    const handleActionPopoverClick = (event) => {
        setAnchorElAction(event.currentTarget);
    };

    const handleActionPopoverClose = () => {
        setAnchorElAction(null);
    };

    const openActionPopover = Boolean(anchorElAction);
    const actionPopoverId = openActionPopover ? 'simple-popover1' : undefined;

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'name',
            headerCheckboxSelection: true,
            checkboxSelection: (params) => {
                return !!params.data && params.data.year === 2012;
            },
            showDisabledCheckboxes: true,
        },
        { field: 'category' },
        { field: 'vendor' },
        { field: 'description' },
        { field: 'price' },
        { field: 'quantity' },
        { field: 'status' },
        {
            field: '',
            cellRenderer: BtnCellRenderer,
            cellRendererParams: {
                clicked: function (event, field) {
                    handleActionPopoverClick(event, field);
                },
            }
        },
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true
    }));

    // Example of consuming Grid Event
    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
    }, []);

    // Example load data from server
    useEffect(() => {
        fetch('http://localhost:8080/ims/products/')
            .then(result => result.json())
            .then(rowData => setRowData(rowData));
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const handleChange = (event) => {
        console.log(event);
    };

    const navigateToViewEdit = (tag, data) => {
        console.log(" navigateToViewEdit ", tag, data);
        // navigate('/newProduct', { state: { id: id, tag: tag } });
    };

    const onDeleteRecord = () => {

    };

    return (
        <div>
            <strong style={{ fontSize: "1.5rem" }}>Products</strong>
            <Grid container style={{ padding: "10px", background: "#FFFFFF", marginTop: "16px" }}>
                <Grid xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <SearchIcon sx={{ fontSize: 40 }} style={{ color: "darkgrey" }}
                            onClick={handleClick} />
                    </div>
                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6" style={{ width: "350px" }}>Filters</Typography>
                        <SearchIcon sx={{ fontSize: 40 }} style={{ color: "darkgrey" }} />
                    </div> */}
                    <div>
                        <Button variant="contained" style={{ background: "white", color: "black" }}>Export</Button>
                        <Button variant="contained" style={{ background: "darkblue", color: "white", marginLeft: "16px" }}
                            onClick={routeChange}>New Product</Button>
                    </div>
                </Grid>
            </Grid>
            <Grid container style={{ padding: "10px", background: "#FFFFFF" }}>
                <Grid xs={12}>
                    {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
                    <div className="ag-theme-alpine" style={{ height: 500 }}>
                        <AgGridReact
                            ref={gridRef} // Ref for accessing Grid's API

                            rowData={rowData} // Row Data for Rows

                            columnDefs={columnDefs} // Column Defs for Columns
                            defaultColDef={defaultColDef} // Default Column Properties

                            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                            rowSelection='multiple' // Options - allows click selection of rows

                            pagination={true}

                            onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                        />
                    </div>
                </Grid>
            </Grid>
            <div>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    sx={{
                        '& .MuiPopover-paper': {
                            padding: "10px 0 0 10px",
                            width: "400px",
                        }
                    }}
                >
                    <div style={{ width: "97%" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                value={""}
                                onChange={handleChange("productName")} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={""}
                                label="Category"
                                placeholder="Select Category"
                                onChange={handleChange("category")}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={""}
                                label="Vendor"
                                placeholder="Select Vendor"
                                onChange={handleChange("Vendor")}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-select-label">Price</InputLabel>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                value={""}
                                onChange={handleChange("Price")} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={""}
                                label="Status"
                                placeholder="Select Status"
                                onChange={handleChange("Status")}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </div>
                        <div style={{ padding: "10px", display: "flex", justifyContent: "right" }}>
                            <Button variant="contained" style={{ background: "white", color: "black" }}>Cancel</Button>
                            <Button variant="contained" style={{ background: "darkblue", color: "white", marginLeft: "16px" }}>Filter</Button>
                        </div>
                    </div>
                </Popover>
            </div>
            <div>
                <Popover
                    id={actionPopoverId}
                    open={openActionPopover}
                    anchorEl={anchorElAction}
                    onClose={handleActionPopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography sx={{ p: 1 }} onClick={(event) => navigateToViewEdit("VIEW", event)}>View</Typography>
                    <Typography sx={{ p: 1 }} onClick={(event) => navigateToViewEdit("EDIT", event)}>Edit</Typography>
                    <Typography sx={{ p: 1 }} onClick={onDeleteRecord}>Delete</Typography>
                </Popover>
            </div>
        </div>
    );
}

export default Dashboard;
