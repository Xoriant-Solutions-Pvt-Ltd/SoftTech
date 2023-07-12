import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { VENDORS, CATEGORY } from '../../Shared/common';
import { ToastContainer, toast } from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import "../product/product.css";  // Importing css file

function Product() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const formikRef = useRef();
    // const { data, tag } = state; // Read values passed on state

    const [isSubmitted, setIsSubmitted] = useState(state && state.tag === "VIEW" ? true : false);

    const [initialValues, setInitialValues] = useState({
        productName: "",
        description: "",
        category: "",
        vendor: "",
        price: "",
        quantity: "",
        status: "",
    });

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

    useEffect(() => {
        if (state && (state.tag === "EDIT" || state.tag === "VIEW")) {
            const { data } = state;
            initialValues.productName = data.name;
            initialValues.description = data.description;
            initialValues.category = data.category;
            initialValues.vendor = data.vendor;
            initialValues.price = data.price;
            initialValues.quantity = data.quantity;
            initialValues.status = data.status;
            console.log(initialValues);
            setInitialValues(initialValues);
        }
    }, []);

    const notify = (message)=>{
        // Calling toast method by passing string
        toast(message)
    }

    const handleSubmit = (values, errors) => {
        const postObj = {
            name: values.productName,
            description: values.description,
            category: values.category,
            quantity: values.quantity,
            price: values.price,
            vendor: values.vendor,
            status: values.status,
            created_at: new Date(),
            updated_at: new Date(),
        }
        if (state && state.tag === "EDIT") {
            axios.put(`http://localhost:8080/ims/products/${state.data.id}`, postObj).then(response => {
                formikRef.current?.resetForm();
                setIsSubmitted(true);
                notify("Product updated successfully");
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            }).catch(error => console.error(error));
        } else {
            axios.post(`http://localhost:8080/ims/products`, postObj).then(response => {
                formikRef.current?.resetForm();
                setIsSubmitted(true);
                notify("Product added successfully")
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            }).catch(error => console.error(error));
        }
    };

    const handleOnCancel = () => {
        navigate(-1);
    };

    return (
        <div>
            <strong className="page-title">New Product</strong>
            <Grid container className="product-page-grid-container">
                <Grid xs={12}>
                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        onSubmit={(values, errors) => {
                            handleSubmit(values, errors);
                        }}
                        validationSchema={validationSchema}
                        disabled={!isSubmitted}
                    >
                        {({ values, errors, touched, handleSubmit, handleChange, handleBlur, resetForm }) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <Grid container className="grid-field-container">
                                        <Grid xs={12} className="grid-item">
                                            <div>
                                                <Button variant="contained" className="btn-cancel"
                                                    type='button' onClick={handleOnCancel}>Cancel</Button>
                                                <Button variant="contained" className="btn-submit" style={{ opacity: isSubmitted ? "0.5" : "1" }}
                                                    type='submit' disabled={isSubmitted}>Save</Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <div className="form-container">
                                        <div className="div-field-container">
                                            <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="outlined-basic"
                                                variant="outlined"
                                                name="productName"
                                                value={values.productName}
                                                disabled={isSubmitted}
                                                onChange={handleChange("productName")}
                                                onBlur={handleBlur("productName")} />
                                            <div className="div-error-message">{touched.productName && errors.productName}</div>
                                        </div>
                                        <div className="div-field-container">
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
                                                disabled={isSubmitted}
                                                onChange={handleChange("description")}
                                                onBlur={handleBlur("description")} />
                                            <div className="div-error-message">{touched.description && errors.description}</div>
                                        </div>
                                        <div className="div-field-container">
                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                            <Select
                                                fullWidth
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name='category'
                                                value={values.category}
                                                disabled={isSubmitted}
                                                placeholder="Select Category"
                                                onChange={handleChange("category")}
                                                onBlur={handleBlur("category")}
                                            >
                                                {CATEGORY.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                            <div className="div-error-message">{touched.category && errors.category}</div>
                                        </div>
                                        <div className="div-select-vendor">
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
                                                <Select
                                                    fullWidth
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name='vendor'
                                                    value={values.vendor}
                                                    disabled={isSubmitted}
                                                    placeholder='Select Vendor'
                                                    onChange={handleChange("vendor")}
                                                    onBlur={handleBlur("vendor")}
                                                >
                                                    {VENDORS.map((item, index) => {
                                                        return (
                                                            <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                                <div className="div-error-message">{touched.vendor && errors.vendor}</div>
                                            </div>
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Price</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    name="price"
                                                    value={values.price}
                                                    disabled={isSubmitted}
                                                    onChange={handleChange("price")}
                                                    onBlur={handleBlur("price")} />
                                                <div className="div-error-message">{touched.price && errors.price}</div>
                                            </div>
                                            <div>
                                                <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    name="quantity"
                                                    value={values.quantity}
                                                    disabled={isSubmitted}
                                                    onChange={handleChange("quantity")}
                                                    onBlur={handleBlur("quantity")} />
                                                <div className="div-error-message">{touched.quantity && errors.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="div-field-container">
                                            <FormLabel id="status">Status</FormLabel>
                                            <RadioGroup
                                                fullWidth
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="status"
                                                value={values.status}
                                                onChange={handleChange}
                                                className="radio-group-status"
                                                onBlur={handleBlur("status")}
                                            >
                                                <FormControlLabel disabled={isSubmitted} value="OutOfStock" control={<Radio />} label="Out Of Stock" />
                                                <FormControlLabel disabled={isSubmitted} value="InStock" control={<Radio />} label="Active" />
                                            </RadioGroup>
                                            <div className="div-error-message">{touched.status && errors.status}</div>
                                        </div>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                </Grid>
                <ToastContainer autoClose={2000} />
            </Grid>
        </div>
    );
}

export default Product;
