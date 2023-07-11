import { Button, Dialog, DialogActions, DialogTitle, Grid, InputLabel, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState, MouseEvent, HTMLButtonElement } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import BtnCellRenderer from '../cell-renderer/BtnCellRenderer';
import { CATEGORY, STATUS, VENDORS } from '../../Shared/common';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import StatusCellRenderer from '../cell-renderer/StatusCellRenderer';
import { ToastContainer, toast } from 'react-toastify';

function Dashboard() {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    const [filterState, setFilterState] = useState({
        isFiltering: false,
        name: '',
        category: '',
        vendor: '',
        price: '',
        status: '',
    }); // Set filterState to Object, one property per Column

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedData, setSelectedData] = useState(); // Set rowData to Array of Objects, one Object per Row

    const [openDialog, setOpenDialog] = useState(false);

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

    var checkboxSelection = function (params) {
        // we put checkbox on the name if we are not doing grouping
        return params.columnApi.getRowGroupColumns().length === 0;
    };

    var headerCheckboxSelection = function (params) {
        // we put checkbox on the name if we are not doing grouping
        return params.columnApi.getRowGroupColumns().length === 0;
    };

    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'name',
            headerCheckboxSelection: true,
            checkboxSelection: checkboxSelection,
            showDisabledCheckboxes: headerCheckboxSelection,
            // comparator: filterData
        },
        { field: 'category' },
        { field: 'vendor' },
        { field: 'description' },
        { field: 'price' },
        { field: 'quantity' },
        { field: 'status', cellRenderer: StatusCellRenderer },
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
        setSelectedData(event.data);
    }, []);

    // Example load data from server
    useEffect(() => {

    }, []);

    // Example using Grid's API
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);

    const handleOnGrdiReady = (params) => {
        axios.get(`http://localhost:8080/ims/products/`)
            .then(rowData => {
                console.log("rowData", rowData.data);
                setRowData(rowData.data);
            }).catch(error => console.error(error));

        // const sortModel = [
        //     { colId: 'recordStartTime', sort: 'desc' }
        // ];
        // this.gridApi.setSortModel(sortModel);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilterState(prevState => ({
            ...prevState,
            isFiltering: true,
            [name]: value
        }));
    };

    const navigateToViewEdit = (tag) => {
        navigate('/newProduct', { state: { data: selectedData, tag: tag } });
    };

    const handleOnOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleOnCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOnConfirmDialog = () => {
        axios.delete(`http://localhost:8080/ims/products/${selectedData.id}`).then(response => {
            toast.success("Record deleted successfully");
            handleOnCloseDialog();
            setTimeout(() => {
                navigate(0);
            }, 2000);
        }).catch(error => console.error(error));
    }

    const onDeleteRecord = () => {
        handleOnOpenDialog();
    };

    const handleOnSortChanged = ({ api: { sortController } }) => {
        const sortModel = sortController.getSortModel();
        if (sortModel.length > 0) {
            const { colId, sort } = sortModel[0];
            axios.get(`http://localhost:8080/ims/products/?columnName=${colId}&sortBy=${sort}&pageNumber=${currentPage}&noOfRecords=10`)
                .then(rowData => {
                    setSortField(colId);
                    setSortOrder(sort);
                    console.log("rowData", rowData.data);
                    setRowData(rowData.data);
                }).catch(error => {
                    console.error(error)
                });
        } else {
            setSortField(null);
            setSortOrder(null);
        }
    };

    const handleChangePage = ({ api: { paginationProxy } }) => {
        const currPage = paginationProxy.getCurrentPage();
        // axios.get(`http://localhost:8080/ims/products/?columnName=${sortField}&sortBy=${sortOrder}&pageNumber=${currPage + 1}&noOfRecords=10`)
        // .then(rowData => {
        //     console.log("rowData", rowData.data);
        //     setRowData(rowData.data);
        //     setCurrentPage(currPage + 1);
        // }).catch(error => {
        //     console.error(error)
        // });
    };

    const onRemoveFilter = (key) => {
        let newFilterObj = filterState;
        newFilterObj[key] = '';
        setFilterState({ ...filterState, ...newFilterObj });
    };

    return (
        <div>
            <strong style={{ fontSize: "1.5rem" }}>Products</strong>
            <Grid container style={{ padding: "10px", background: "#FFFFFF", marginTop: "16px" }}>
                <Grid xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <SearchIcon sx={{ fontSize: 40 }} style={{ color: "darkgrey" }}
                            onClick={handleClick} />
                        {
                            filterState.isFiltering && Object.entries(filterState).map(([key, value]) => {
                                if (value !== "" && key !== "isFiltering") {
                                    return (
                                        <div key={key} style={{ marginLeft: "16px", display: "flex", alignItems: "center", background: "lightGrey", padding: "5px" }}>
                                            {key}: <strong>{value}</strong><CloseIcon onClick={() => onRemoveFilter(key)} sx={{ fontSize: 20, marginLeft: "8px" }} />
                                        </div>
                                    )
                                } else {
                                    return null;
                                }
                            })
                        }
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

                            paginationPageSize={10}

                            onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                            onGridReady={handleOnGrdiReady} // Optional - registering for Grid Event

                            onSortChanged={handleOnSortChanged} // Optional - registering for Grid Event

                            onPaginationChanged={handleChangePage} // Optional - registering for Grid Event
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
                            <InputLabel id="demo-simple-label">Product Name</InputLabel>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                name="name"
                                variant="outlined"
                                value={filterState.name}
                                onChange={handleChange} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-label">Category</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="category"
                                value={filterState.category}
                                label="Category"
                                placeholder="Select Category"
                                onChange={handleChange}
                            >
                                {CATEGORY.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="vendor"
                                value={filterState.vendor}
                                label="Vendor"
                                placeholder="Select Vendor"
                                onChange={handleChange}
                            >
                                {VENDORS.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-label">Price</InputLabel>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                name="price"
                                variant="outlined"
                                value={filterState.price}
                                onChange={handleChange} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <InputLabel id="demo-simple-label">Status</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="status"
                                name="status"
                                value={filterState.status}
                                label="Status"
                                placeholder="Select Status"
                                onChange={handleChange}
                            >
                                {STATUS.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                    )
                                })}
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
                    <Typography sx={{ p: 1 }} onClick={() => navigateToViewEdit("VIEW")}>View</Typography>
                    <Typography sx={{ p: 1 }} onClick={() => navigateToViewEdit("EDIT")}>Edit</Typography>
                    <Typography sx={{ p: 1 }} onClick={onDeleteRecord}>Delete</Typography>
                </Popover>
            </div>
            <div>
                <Dialog
                    open={openDialog}
                    onClose={handleOnCloseDialog}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Are you sure you want to delete this record?
                    </DialogTitle>
                    <DialogActions>
                        <Button autoFocus onClick={handleOnCloseDialog}>Cancel</Button>
                        <Button onClick={handleOnConfirmDialog}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <ToastContainer autoClose={2000} />
        </div>
    );
}

export default Dashboard;
