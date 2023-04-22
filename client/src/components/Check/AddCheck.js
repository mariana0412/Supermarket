import AppNavbar from "../AppNavbar";
import {Button, Container, Form, FormGroup, Input, Label} from "reactstrap";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const AddCheck = () => {
    const initialCheck = {
        check_number: '',
        id_employee: '',
        card_number: '',
        print_date: '',
        sum_total: 0,
        vat: 0
    }
    const [check, setCheck] = useState(initialCheck);
    const [products, setProducts] = useState([]);
    const [storeProducts, setStoreProducts] = useState([]);
    const [customerCards, setCustomerCards] = useState([]);
    const [selectedCustomerCard, setSelectedCustomerCard] = useState(null);
    const [sales, setSales] = useState([{ upc: '', product_number: 0 }]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/products`)
            .then(response => response.json())
            .then(data => setProducts(data));

        fetch(`/api/store-products`)
            .then(response => response.json())
            .then(data => setStoreProducts(data));

        fetch(`/api/customer-cards`)
            .then(response => response.json())
            .then(data => setCustomerCards(data));
    }, []);

    const storeProductsOptions = storeProducts.map((storeProduct) => {
        return (
            <option key={storeProduct.upc} value={storeProduct.upc}>
                {products.find(p => p.id_product === storeProduct.id_product)?.product_name} (
                {storeProduct.promotional_product ? 'prom' : 'not prom'})
            </option>
        );
    });

    const customerCardsOptions = customerCards.map((customerCard) => {
        return (
            <option key={customerCard.card_number} value={customerCard.card_number}>
                {customerCard.cust_surname} {customerCard.cust_name} {customerCard?.cust_patronymic}
            </option>
        );
    });

    const handleCustomerCardChange = (event) => setSelectedCustomerCard(event.target.value);

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...sales];
        list[index][name] = value;
        setSales(list);
    }

    const handleRemoveSale = (index) => {
        const list = [...sales];
        list.splice(index, 1);
        setSales(list);
    }

    const handleAddSale = () => setSales([...sales, { upc: '', product_number: 0 }]);

    const handleCreateCheck = async (event) => {
        event.preventDefault();

        // generate check number
        check.check_number = Date.now().toString().substring(0, 10);

        // give selling_price and check_number to each sale
        sales.map(sale => ((sale.selling_price =
            storeProducts.find(storeProduct => (sale.upc === storeProduct.upc))
                .selling_price) && (sale.check_number = check.check_number)));

        check.card_number = selectedCustomerCard;
        check.id_employee = 'f3k77dls92'; // TODO: get current cashier ID
        check.print_date = new Date();
        sales.map(sale => check.sum_total += sale.product_number * sale.selling_price)
        check.vat = check.sum_total * 0.2;

        // create receipt
        await fetch(`/api/checks`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(check)
        });

        // create sales
        const salesPromises = sales.map(sale => {
            return fetch(`/api/sales`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sale)
            });
        });

        await Promise.all(salesPromises);

        setCheck(initialCheck);
        setSales([{ upc: '', product_number: 0 }])
        navigate('/checks');
    };

    return (
        <div>
            <AppNavbar />
            <Container>
                <h2>Add Check</h2>
                <Form onSubmit={handleCreateCheck}>
                    <FormGroup>
                        <Label for="upc">Customer Card</Label>
                        <Input
                            type="select"
                            name="customer_card"
                            id="customer_card"
                            onChange={handleCustomerCardChange}>
                            <option value="">Select Customer Card</option>
                            {customerCardsOptions}
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        {sales.map((sale, index) => (
                                <FormGroup key={index}>
                                    <Label for="upc">Store Product</Label>
                                    <Input
                                        type="select"
                                        name="upc"
                                        id="upc"
                                        value={sale.upc}
                                        onChange={e => handleInputChange(e, index)}
                                    >
                                        <option value="">Select Store Product</option>
                                        {storeProductsOptions}
                                    </Input>

                                    <Label for="product_number">Number</Label>
                                    <Input
                                        type="number"
                                        name="product_number"
                                        value={sale.product_number}
                                        required
                                        onChange={e => handleInputChange(e, index)}
                                    />
                                    <Button className="buttonWithMargins" onClick={() => handleRemoveSale(index)}>
                                        Remove
                                    </Button>
                                </FormGroup>
                            ))}
                    </FormGroup>

                    <Button className="buttonWithMargins" onClick={handleAddSale}>
                        Add Sale
                    </Button>

                    <div>
                        {/*<p>Total: {total}</p>*/}
                    </div>

                    <FormGroup>
                        <Button className="buttonWithMargins" color="primary" type="submit">Save</Button>
                        <Button className="buttonWithMargins" color="secondary" tag={Link} to={"/checks"}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}

export default AddCheck;