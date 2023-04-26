import AppNavbar from "../AppNavbar";
import {Button, Container, Form, FormGroup, Input, Label} from "reactstrap";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLastPath from "../../hooks/useLastPath";

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
    const {auth} = useAuth();
    useLastPath();

    useEffect(() => {
        fetch(`/api/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => setProducts(data));

        fetch(`/api/store-products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => setStoreProducts(data));

        fetch(`/api/customer-cards`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
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

    const handleAddSale = () => setSales([...sales, { upc: '', product_number: 0 }]);

    const correctUPCsInSales = () => {
        let correct = true;
        sales.forEach(sale => {
            if (!sale.upc || sale.upc.trim() === "")
                correct = false;
        });
        return correct;
    }

    const duplicatedSales = () => {
        const upcs = sales.map((sale) => sale.upc);
        const uniqueUpcs = new Set(upcs);
        return upcs.length !== uniqueUpcs.size;
    }

    const setCheckNumberToSales = (check_number) => sales.map(sale => sale.check_number = check_number);
    const setSellingPriceToSales = () => {
        sales.map(sale => {
            const storeProduct = storeProducts.find(storeProduct => (sale.upc === storeProduct.upc));
            sale.selling_price = storeProduct.selling_price;
        });
    };

    const calculateCheckTotalSum = (customerSalePercent = 0) => {
        let totalSum = 0;
        sales.forEach(sale => {
            const salePrice = sale.product_number * sale.selling_price;
            totalSum += salePrice;
        });
        return totalSum * ((100 - customerSalePercent) / 100);
    };

    const getProductName = (saleUPC) => {
        const storeProduct = storeProducts
            .find(storeProduct => (storeProduct.upc === saleUPC));
        const product = products
            .find(product => (product.id_product === storeProduct.id_product));
        return product.product_name;
    };

    const getStoreProductNumber = (saleUPC) => {
        const storeProduct = storeProducts.find(storeProduct => storeProduct.upc === saleUPC);
        return storeProduct.products_number;
    }

    const formAlertMessage = (responseText, productName, trueProductNumber, wantedProductNumber) => {
        return responseText
            + `\n\nStore product: ${productName}.`
            + `\nNumber: ${trueProductNumber}.`
            + `\nYou want: ${wantedProductNumber}`;
    }

    const handleCreateCheck = async (event) => {
        event.preventDefault();
        if(!correctUPCsInSales()) {
            alert("Please, enter all store products.");
            return;
        }

        if(duplicatedSales()) {
            alert("Duplicated sales!");
            return;
        }
        setSellingPriceToSales();

        check.check_number = Date.now().toString().substring(0, 10);
        check.card_number = selectedCustomerCard;
        check.id_employee = auth?.employeeId;
        const salePercent = customerCards.find(customerCard => customerCard.card_number === selectedCustomerCard)?.percent;
        check.sum_total = calculateCheckTotalSum(salePercent);

        try {
            const checkResponse = await fetch(`/api/checks`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(check)
            });

            if(checkResponse.ok) {
                const salesPromises = sales.map(async sale => {
                    setCheckNumberToSales(check.check_number);
                    const response = await fetch(`/api/sales`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(sale)
                    });

                    if (response.status === 409) {
                        const responseText = await response.text();
                        const productName = getProductName(sale.upc);
                        const productNumber = getStoreProductNumber(sale.upc);
                        alert(formAlertMessage(responseText, productName, productNumber, sale.product_number));
                        throw new Error(responseText);
                    }
                });

                await Promise.all(salesPromises);

                setCheck(initialCheck);
                setSales([{upc: '', product_number: 0}])
                navigate('/checks');
            } else {
                alert(await checkResponse.text())
            }
        } catch (error) {
            console.error(error);
        }
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
                                    max={storeProducts.find(storeProduct => storeProduct.upc === sale.upc)?.products_number}
                                    required
                                    onChange={e => handleInputChange(e, index)}
                                />
                            </FormGroup>
                        ))}
                    </FormGroup>

                    <Button className="buttonWithMargins" onClick={handleAddSale}>
                        Add Sale
                    </Button>

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

