import React from 'react';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import Product from './Product';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserEvent from "@testing-library/user-event";

const props = {
    onChangeProductName: jest.fn(),
    spyOnSelectChange: jest.fn(),
};

const spyOnSelectChange = jest.fn();

describe('Test cases for Product Page', () => {

    test('should render Product Page', () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );
        expect(renComp).not.toBeNull();
    });

    test('should render New Product title', () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );
        expect(renComp.getByText('New Product')).toBeInTheDocument();
    });

    test('should render New Product"', () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );
        expect(renComp.getByText('New Product')).toBeInTheDocument();
        expect(renComp.getByText('Cancel')).toBeInTheDocument();
        expect(renComp.getByText('Product Name')).toBeInTheDocument();
        expect(renComp.getByText('Description')).toBeInTheDocument();
        expect(renComp.getByText('Category')).toBeInTheDocument();
        expect(renComp.getByText('Vendor')).toBeInTheDocument();
        expect(renComp.getByText('Price')).toBeInTheDocument();
        expect(renComp.getByText('Quantity')).toBeInTheDocument();
        expect(renComp.getByText('Status')).toBeInTheDocument();
    });

    test('should render error messages if user touched fields', async () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );
        const productNameField = renComp.getByTestId("productName", { selector: 'input' });
        fireEvent.touchEnd(productNameField, { target: { value: "" } });
        const productNameFieldError = renComp.getByTestId("name-error");
        expect(productNameFieldError).toBeInTheDocument();
        // const productNameFieldErrorVal = renComp.getByTestId("name-error").getAttribute("value");
        // await waitFor(() => expect(productNameFieldErrorVal).toBe("Product name is required"));

        const descriptionField = renComp.getByTestId("description", { selector: 'textarea' });
        fireEvent.touchEnd(descriptionField, { target: { value: "" } });
        const descriptionFieldError = renComp.getByTestId("description-error");
        expect(descriptionFieldError).toBeInTheDocument();

        const priceField = renComp.getByTestId("price", { selector: 'input' });
        fireEvent.touchEnd(priceField, { target: { value: "" } });
        const priceFieldError = renComp.getByTestId("price-error");
        expect(priceFieldError).toBeInTheDocument();

        const quantityField = renComp.getByTestId("quantity", { selector: 'input' });
        fireEvent.touchEnd(quantityField, { target: { value: "" } });
        const quantityFieldError = renComp.getByTestId("quantity-error");
        expect(quantityFieldError).toBeInTheDocument();
    });

    test('should render error messages if inputs are empty on change', async () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );
        const productNameField = renComp.getByTestId("productName", { selector: 'input' });
        fireEvent.change(productNameField, { target: { value: "" } });
        const productNameFieldError = renComp.getByTestId("name-error");
        expect(productNameFieldError).toBeInTheDocument();
        // const productNameFieldErrorVal = renComp.getByTestId("name-error").getAttribute("value");
        // await waitFor(() => expect(productNameFieldErrorVal).toBe("Product name is required"));

        const descriptionField = renComp.getByTestId("description", { selector: 'textarea' });
        fireEvent.change(descriptionField, { target: { value: "" } });
        const descriptionFieldError = renComp.getByTestId("description-error");
        expect(descriptionFieldError).toBeInTheDocument();

        const priceField = renComp.getByTestId("price", { selector: 'input' });
        fireEvent.change(priceField, { target: { value: "" } });
        const priceFieldError = renComp.getByTestId("price-error");
        expect(priceFieldError).toBeInTheDocument();

        const quantityField = renComp.getByTestId("quantity", { selector: 'input' });
        fireEvent.change(quantityField, { target: { value: "" } });
        const quantityFieldError = renComp.getByTestId("quantity-error");
        expect(quantityFieldError).toBeInTheDocument();
    });

    test('should render text field on change valus of inputs', async () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );
        const productNameVal = renComp.getByTestId("productName", { selector: 'input' });
        fireEvent.change(productNameVal, { target: { value: "Dell Laptop" } });
        expect(productNameVal.value).toBe("Dell Laptop");

        const descriptionVal = renComp.getByTestId("description", { selector: 'textarea' });
        fireEvent.change(descriptionVal, { target: { value: "Dell Laptop electronics product" } });
        expect(descriptionVal.value).toBe("Dell Laptop electronics product");

        const priceValue = renComp.getByTestId("price", { selector: 'input' });
        fireEvent.change(priceValue, { target: { value: "1299" } });
        expect(priceValue.value).toBe("1299");

        const quantityVal = renComp.getByTestId("quantity", { selector: 'input' });
        fireEvent.change(quantityVal, { target: { value: "10" } });
        expect(quantityVal.value).toBe("10");
    });


    test('should be able to render Select Category Dropdown', async () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );

        const selectCompoEl = renComp.getAllByTestId('category')[0];

        const button = within(selectCompoEl).getByRole('button');
        fireEvent.mouseDown(button);

        const listbox = within(screen.getByRole('presentation')).getByRole(
            'listbox'
        );

        const options = within(listbox).getAllByRole('option');
        const optionValues = options.map((li) => li.getAttribute('data-value'));

        expect(optionValues).toEqual(['', 'Electronics', 'Clothing', "Furniture", "Food", "Toys"]);

        // fireEvent.click(options[2]);
        // expect(spyOnSelectChange).toHaveBeenCalledWith('Electronics');

        expect(options[2]).toBeInTheDocument();
        expect(options[2].textContent).toBe("Clothing");


        // const selectCategoryDropdown = renComp.getByTestId('category');
        // fireEvent.keyDown(selectCategoryDropdown, { key: "ArrowDown" });
        // const existingItem = await screen.findByText('Electronics')
        // fireEvent.click(existingItem);


        // UserEvent.click(
        //     within(screen.getByTestId('category').parentElement).getByRole('button')
        //   );
        //   UserEvent.click(await screen.findByText('Electronics'));
        //   expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();


        // await waitFor(() => {
        //     const selectCategoryDropdown = renComp.getByTestId('category');
        //     expect(selectCategoryDropdown).toBeInTheDocument();
        //     fireEvent.click(selectCategoryDropdown);
        //     const optionToSelect = screen.getByText('Electronics');
        //     expect(optionToSelect).toBeInTheDocument();
        // });

        // UserEvent.selectOptions(
        //     // Find the select element
        //     screen.getByRole('button', {name: 'Category'}),
        //     // Find and select the Ireland option
        //     screen.getByRole('option', {name: 'Electronics'}),
        //   )
        //   expect(screen.getByRole('option', {name: 'Electronics'}).selected).toBe(true)
    });


    test('should be able to render Select Vendor Dropdown', async () => {
        const renComp = render(
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Product />} />
                </Routes>
            </BrowserRouter>
        );

        const selectCompoEl = renComp.getAllByTestId('vendor')[0];

        const button = within(selectCompoEl).getByRole('button');
        fireEvent.mouseDown(button);

        const listbox = within(screen.getByRole('presentation')).getByRole(
            'listbox'
        );

        const options = within(listbox).getAllByRole('option');
        const optionValues = options.map((li) => li.getAttribute('data-value'));

        expect(optionValues).toEqual(['', 'MI', 'Myntra', "Amazon", "Zomato", "FirstCry"]);

        // fireEvent.click(options[2]);
        // expect(spyOnSelectChange).toHaveBeenCalledWith('Electronics');

        expect(options[2]).toBeInTheDocument();
        expect(options[2].textContent).toBe("Myntra");
    });


    // test('should be able to select data from Select Vendor Dropdown', async () => {
    //     const renComp = render(
    //         <BrowserRouter>
    //             <Routes>
    //                 <Route path="*" element={<Product />} />
    //             </Routes>
    //         </BrowserRouter>
    //     );
    //     // Before change selection
    //     const allValueRadioButton = renComp.getByRole('radiogroup');
    //     expect(allValueRadioButton.checked).toEqual(true);

    //     // Change selection
    //     const withValueRadioButton = renComp.getByRole('radiogroup');
    //     fireEvent.click(withValueRadioButton, { target: { checked: true } });
    //     expect(withValueRadioButton.checked).toEqual(true);

    //     // Old value is no more checked
    //     expect(allValueRadioButton.checked).toEqual(false);
    // });



});