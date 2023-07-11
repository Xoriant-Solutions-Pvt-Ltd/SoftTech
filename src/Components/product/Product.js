import React, { useState } from 'react';
import axios from 'axios';
import { Button, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from "yup";

function Product() {

    const initialValues = {
        productName: "",
        description: "",
        category: "",
        vendor: "",
        price: "",
        quantity: "",
        status: "",
    };

    const validationSchema = Yup.object().shape({
        productName: Yup.string()
            .required("Product name is required"),
        description: Yup.string()
            .required("Description is required"),
        category: Yup.string()
            .required("Category is required"),
        vendor: Yup.string()
            .required("Vendor is required"),
        price: Yup.string()
            .required("Price is required"),
        quantity: Yup.string()
            .required("Quantity is required"),
        status: Yup.string()
            .oneOf(["InStock", "OutOfStock"], "Status is required").required("Status is required"),
    });

    const handleSubmit = (values, errors) => {
        const postObj = {
            name: values.productName,
            description: values.description,
            category: values.category,
            quantity: values.quantity,
            price: values.price,
            sku: values.sku,
            status: values.status,
            created_at: new Date(),
            updated_at: new Date(),
        }
        console.log(postObj);
        axios.post(`http://localhost:8080/ims/product/`, {
            headers: {
                contentType: "application/json",
            }
        }, postObj).then(response => {
            console.log(response);
        }).catch(error => console.error(error));
    };

    return (
        <div>
            <strong style={{ fontSize: "1.5rem" }}>New Product</strong>
            <Grid container style={{ padding: "10px", background: "#FFFFFF", marginTop: "16px" }}>
                <Grid xs={12}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, errors) => {
                            handleSubmit(values, errors);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <Grid container style={{ padding: "10px", background: "#FFFFFF" }}>
                                        <Grid xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                            <div>
                                                <Button variant="contained" style={{ background: "white", color: "black" }}
                                                    type='button'>Cancel</Button>
                                                <Button variant="contained" style={{ background: "darkblue", color: "white", marginLeft: "16px" }}
                                                    type='submit'>Save</Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <div style={{ width: "70%" }}>
                                        <div style={{ marginBottom: "10px" }}>
                                            <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="outlined-basic"
                                                variant="outlined"
                                                name="productName"
                                                value={values.productName}
                                                onChange={handleChange("productName")}
                                                onBlur={handleBlur("productName")} />
                                            <div style={{ color: "red" }}>{touched.productName && errors.productName}</div>
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <InputLabel id="demo-simple-select-label">Description</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="outlined-basic"
                                                variant="outlined"
                                                name="description"
                                                multiline
                                                rows={3}
                                                maxRows={4}
                                                value={values.description}
                                                onChange={handleChange("description")}
                                                onBlur={handleBlur("description")} />
                                            <div style={{ color: "red" }}>{touched.description && errors.description}</div>
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                            <Select
                                                fullWidth
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name='category'
                                                value={values.category}
                                                placeholder="Select Category"
                                                onChange={handleChange("category")}
                                                onBlur={handleBlur("category")}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                            <div style={{ color: "red" }}>{touched.category && errors.category}</div>
                                        </div>
                                        <div style={{ display: "flex", marginBottom: "10px", justifyContent: "space-between" }}>
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
                                                <Select
                                                    fullWidth
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name='vendor'
                                                    value={values.vendor}
                                                    placeholder='Select Vendor'
                                                    onChange={handleChange("vendor")}
                                                    onBlur={handleBlur("vendor")}
                                                >
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>
                                                <div style={{ color: "red" }}>{touched.vendor && errors.vendor}</div>
                                            </div>
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Price</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    name="price"
                                                    value={values.price}
                                                    onChange={handleChange("price")}
                                                    onBlur={handleBlur("price")} />
                                                <div style={{ color: "red" }}>{touched.price && errors.price}</div>
                                            </div>
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    name="quantity"
                                                    value={values.quantity}
                                                    onChange={handleChange("quantity")}
                                                    onBlur={handleBlur("quantity")} />
                                                <div style={{ color: "red" }}>{touched.quantity && errors.quantity}</div>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: "10px" }}>
                                            <FormLabel id="status">Status</FormLabel>
                                            <RadioGroup
                                                fullWidth
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="status"
                                                value={values.status}
                                                onChange={handleChange}
                                                style={{ display: "flex", flexDirection: "row" }}
                                                onBlur={handleBlur("status")}
                                            >
                                                <FormControlLabel value="OutOfStock" control={<Radio />} label="Out Of Stock" />
                                                <FormControlLabel value="InStock" control={<Radio />} label="Active" />
                                            </RadioGroup>
                                            {/* <div>
                                                <FormControlLabel name="status" value={values.status === "OutOfStock"} control={<Radio />} label="Out Of Stock" />
                                                <FormControlLabel name="status" value={values.status === "InStock"} control={<Radio />} label="Active" />
                                            </div> */}
                                            <div style={{ color: "red" }}>{touched.status && errors.status}</div>
                                        </div>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                </Grid>
            </Grid>
        </div>
    );
}

export default Product;
