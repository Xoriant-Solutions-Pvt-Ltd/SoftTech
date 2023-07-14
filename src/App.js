import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Common/Navbar';
import Header from './Common/Header';
import Dashboard from './Components/dashboard/dashboard';
import { Grid } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import Product from './Components/product/Product';

function App() {
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');

	const getHelloWorldMessage = () => {
		// axios.get(`http://localhost:8080/hello/${name}`)
		//   .then(response => setMessage(response.data))
		//   .catch(error => console.error(error));
	};

	return (
		<div>
			<Header />
			<Grid container style={{ display: "flex" }}>
				<Grid xs={8} md={1}>
					<Navbar />
				</Grid>
				<Grid xs={8} md={11} style={{ height: "95vh", padding: "10px", background: "lightgrey" }}>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="newProduct" element={<Product />} />
						<Route path="product/:id" element={<Product />} />
						<Route path="product/:id" element={<Product />} />
						{/* <Route path="contact" element={<Contact />} />
						<Route path="*" element={<NoPage />} /> */}
					</Routes>
				</Grid>
			</Grid>
		</div>
	);
}

export default App;
