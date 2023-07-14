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
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import { CSVLink } from 'react-csv';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./dashboard.css";
import PriceCellRenderer from '../cell-renderer/PriceCellRenderer';

function Dashboard() {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    const [pageSize, setPageSize] = useState(10);

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

    const headers = [
        { label: "Product Name", key: "name" },
        { label: "Category", key: "category" },
        { label: "Vendor", key: "vendor" },
        { label: "Description", key: "description" },
        { label: "Price", key: "price" },
        { label: "Quantity", key: "quantity" },
        { label: "Status", key: "status" }
    ];

    const csvReport = {
        data: rowData,
        headers: headers,
        filename: 'Product_Report.csv'
    };

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedData, setSelectedData] = useState(); // Set rowData to Array of Objects, one Object per Row

    const [openDialog, setOpenDialog] = useState(false);

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `newProduct`;
        navigate(path);
    }

    const [anchorEl, setAnchorEl] = useState(null);

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

    const [anchorElExport, setAnchorElExport] = useState(null);

    const handleExportClick = (event) => {
        setAnchorElExport(event.currentTarget);
    };

    const handleExportPopoverClose = () => {
        setAnchorElExport(null);
    };

    const openExportPopover = Boolean(anchorElExport);
    const exportPopoverId = open ? 'simple-popover-export' : undefined;

    const openActionPopover = Boolean(anchorElAction);
    const actionPopoverId = openActionPopover ? 'simple-popover-export' : undefined;

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
        { field: 'price', cellRenderer: PriceCellRenderer },
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
        axios.get(`http://localhost:8080/ims/products?pageNumber=${currentPage}&noOfRecords=${pageSize}`)
            .then(rowData => {
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
            [name]: value
        }));
    };

    const navigateToViewEdit = (tag) => {
        navigate(`/product/${selectedData.id}?mode=${tag}`, { state: { data: selectedData, tag: tag } });
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
            axios.get(`http://localhost:8080/ims/products?columnName=${colId}&sortBy=${sort}&pageNumber=${currentPage}&noOfRecords=${pageSize}`)
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

    const onRemoveFilter = (key) => {
        let newFilterObj = filterState;
        newFilterObj[key] = '';
        onApplyFilter(newFilterObj);
        delete newFilterObj.isFiltering;
        const isEmpty = !Object.values(newFilterObj).some(x => x !== '');
        isEmpty ? newFilterObj['isFiltering'] = false : newFilterObj['isFiltering'] = true;
        setFilterState({ ...filterState, ...newFilterObj });
    };

    const onApplyFilter = (filterState) => {
        axios.get(`http://localhost:8080/ims/products/search?name=${filterState.name}&category=${filterState.category}&price=${filterState.price}&status=${filterState.status}`)
            .then(rowData => {
                if (rowData.data.length !== 0) {
                    setRowData(rowData.data);
                } else {
                    handleOnGrdiReady();
                }
                setAnchorEl(null);
            }).catch(error => {
                console.error(error)
            });
        setFilterState({ ...filterState, isFiltering: true });
    };

    const onClearFilter = () => {
        let newFilterObj = filterState;
        setFilterState({ isFiltering: false, ...Object.keys(newFilterObj).forEach((i) => newFilterObj[i] = "") });
        handleOnGrdiReady();
        setAnchorEl(null);
    };

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const handleExportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(rowData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, 'Products' + fileExtension);
        handleExportPopoverClose();
    };

    const onPaginationChanged = useCallback((event) => {
        const { api, pageSize, paginationProxy } = event;
        const curPage = api.paginationGetCurrentPage();
        if (event.newPage) {
            axios.get(`http://localhost:8080/ims/products?columnName=${sortField}&sortBy=${sortOrder}&pageNumber=${currentPage}&noOfRecords=${pageSize}`)
                .then(rowData => {
                    console.log("rowData", rowData.data);
                    setRowData(rowData.data);
                    setCurrentPage(curPage + 1);
                }).catch(error => {
                    console.error(error)
                });
        }
    }, []);

    const paginationNumberFormatter = useCallback((params) => {
        return '[' + params.value.toLocaleString() + ']';
    }, []);

    const onFirstDataRendered = useCallback((params) => {
        gridRef.current.api.paginationGoToPage(0);
    }, []);

    const onPageSizeChanged = useCallback((event) => {
        const { value } = event.target;
        gridRef.current.api.paginationSetPageSize(Number(value));
        axios.get(`http://localhost:8080/ims/products?columnName=${sortField}&sortBy=${sortOrder}&pageNumber=${currentPage}&noOfRecords=${value}`)
            .then(rowData => {
                console.log("rowData", rowData.data);
                setRowData(rowData.data);
                setPageSize(Number(value));
            }).catch(error => {
                console.error(error)
            });
    }, []);

    return (
        <div>
            <strong className="page-title">Products</strong>
            <Grid container className="grid-product-list-container">
                <Grid xs={12} className="grid-btn-filter-container">
                    <div className="div-filter-container">
                        <SearchIcon sx={{ fontSize: 40 }} className="search-icon"
                            onClick={handleClick} />
                        {
                            filterState.isFiltering && Object.entries(filterState).map(([key, value]) => {
                                if (value !== "" && key !== "isFiltering") {
                                    return (
                                        <div key={key} className="div-filter-lables">
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
                        <Button variant="contained" className="btn-export" onClick={handleExportClick}>
                            Export
                            <KeyboardArrowDownIcon />
                        </Button>
                        <Button variant="contained" className="btn-add-new-product"
                            onClick={routeChange}>New Product</Button>
                    </div>
                </Grid>
            </Grid>
            <Grid container className="grid-data-grid-container">
                <Grid xs={12}>
                    {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
                    <div className="ag-theme-alpine ag-grid">
                        <AgGridReact
                            ref={gridRef} // Ref for accessing Grid's API

                            rowData={rowData} // Row Data for Rows

                            columnDefs={columnDefs} // Column Defs for Columns

                            defaultColDef={defaultColDef} // Default Column Properties

                            animateRows={true} // Optional - set to 'true' to have rows animate when sorted

                            rowSelection='multiple' // Options - allows click selection of rows

                            pagination={true}

                            onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                            onGridReady={handleOnGrdiReady} // Optional - registering for Grid Event

                            onSortChanged={handleOnSortChanged} // Optional - registering for Grid Event

                            paginationNumberFormatter={paginationNumberFormatter}

                            onPaginationChanged={onPaginationChanged}

                            onFirstDataRendered={onFirstDataRendered}
                        />
                    </div>
                    <div className="example-header">
                        <InputLabel id="demo-simple-label">Page Size:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="status"
                            name="status"
                            value={pageSize}
                            label="Status"
                            placeholder="Select Status"
                            className="select-page-size"
                            onChange={onPageSizeChanged}
                        >
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
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
                    <div className="form-container">
                        <div className="div-field-container">
                            <InputLabel id="demo-simple-label">Product Name</InputLabel>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                name="name"
                                variant="outlined"
                                value={filterState.name}
                                onChange={handleChange} />
                        </div>
                        <div className="div-field-container">
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
                        <div className="div-field-container">
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
                        <div className="div-field-container">
                            <InputLabel id="demo-simple-label">Price</InputLabel>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                name="price"
                                variant="outlined"
                                value={filterState.price}
                                onChange={handleChange} />
                        </div>
                        <div className="div-field-container">
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
                        <div className="div-btn-container">
                            <Button variant="contained" className="btn-clear" onClick={onClearFilter}>Clear</Button>
                            <Button variant="contained" className="btn-filter" onClick={() => onApplyFilter(filterState)}>Filter</Button>
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
                <Popover
                    id={exportPopoverId}
                    open={openExportPopover}
                    anchorEl={anchorElExport}
                    onClose={handleExportPopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography sx={{ p: 1 }} onClick={handleExportToExcel}>Export to Excel</Typography>
                    <Typography sx={{ p: 1 }}><CSVLink className="csv-link" {...csvReport}>Export to CSV</CSVLink></Typography>
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
