import React, {useEffect, useRef, useState} from 'react';
import {Button, ButtonGroup, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup,
    Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import '../../App.css';
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import {useReactToPrint} from "react-to-print";
import useLastPath from "../../hooks/useLastPath";

const StoreProductList = () => {

    const [storeProducts, setStoreProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const [searchUPC, setSearchUPC] = useState('');
    const [storeProductDetails, setStoreProductDetails] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const initialPromStoreProduct = {
        upc: '',
        upc_prom: '',
        id_product: 0,
        selling_price: 0,
        products_number: 0,
        promotional_product: true,
    }
    const [promStoreProduct, setPromStoreProduct] = useState(initialPromStoreProduct);
    const [promStoreProductModalOpen, setPromStoreProductModalOpen] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const {auth} = useAuth();
    useLastPath();
    const componentPDF = useRef();

    useEffect(() => {
        fetch(`/api/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        let url = 'api/store-products';
        if (sortOption) {
            url += '?';
            if (sortOption === 'num')
                url += 'sortedByNum=true';
            else if(sortOption === 'name')
                url += 'sortedByName=true';
            else if (sortOption === 'promNum')
                url += 'promSortedByNum=true';
            else if (sortOption === 'promName')
                url += 'promSortedByName=true';
            else if (sortOption === 'notPromNum')
                url += 'notPromSortedByNum=true';
            else if (sortOption === 'notPromName')
                url += 'notPromSortedByName=true';
        }

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (response.status === 204)
                    return null;
                else
                    return response.json();
            })
            .then(data => {
                if (data) {
                    setStoreProducts(data);
                    setShowEmpty(data.length === 0);
                } else {
                    setStoreProducts([]);
                    setShowEmpty(true);
                }
            })
    }, [sortOption, promStoreProduct]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/store-products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedStoreProducts = [...storeProducts].filter(i => i.upc !== id);
                setStoreProducts(updatedStoreProducts);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePromStoreProductNumberChange = (event) => promStoreProduct.products_number = event.target.value;
    const handleSearchInputChange = (event) => setSearchUPC(event.target.value);
    const toggleSort = (option) => (sortOption === option) ? setSortOption(null) : setSortOption(option);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleStoreProductDetailsModal = () => {
        setStoreProductDetails(!storeProductDetails);
        if(storeProductDetails)
            setSearchUPC('');
    };
    const togglePromStoreProductModal = () => setPromStoreProductModalOpen(!promStoreProductModalOpen);

    const showStoreProductDetails = async () => {
        try {
            const response = await fetch(`/api/store-products-details/${searchUPC}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 404) {
                alert('There is no store product with such UPC.');
            } else if(response.ok) {
                const data = await response.json();
                setProductDetails(data);
                toggleStoreProductDetailsModal();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setPromStoreProductAttributes = (storeProduct) => {
        const promSellingPriceCoef = 0.8;
        promStoreProduct.selling_price = storeProduct.selling_price * promSellingPriceCoef;
        promStoreProduct.id_product = storeProduct.id_product;
        togglePromStoreProductModal();
    }

    const createPromStoreProduct = async (event) => {
        event.preventDefault();
        const response = await fetch(`/api/store-products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(promStoreProduct)
        });
        if(response.ok) {
            togglePromStoreProductModal();
            setPromStoreProduct(initialPromStoreProduct);
        } else if(response.status === 409) {
            const message = await response.text();
            alert(message);
        } else {
            const message = await response.text();
            console.log(message);
        }
    }

    const storeProductList = storeProducts.map(storeProduct => {
        const productName = products.find(p => p.id_product === storeProduct.id_product)?.product_name;
        const isPromotional = storeProduct.promotional_product ? "yes" : "no";
        return <tr key={storeProduct.upc}>
            <td>{storeProduct.upc}</td>
            <td>{storeProduct?.upc_prom}</td>
            <td>{productName}</td>
            <td>{storeProduct.selling_price} ₴</td>
            <td>{storeProduct.products_number} </td>
            <td>{isPromotional}</td>
            { auth?.role === "MANAGER"
                &&
                <td>
                    <ButtonGroup>
                        <Button className="buttonWithMargins" size="sm" color="primary" tag={Link}
                                to={"/store-products/" + storeProduct.upc}>
                            Edit
                        </Button>

                        <Button className="buttonWithMargins" size="sm" color="danger"
                                onClick={() => remove(storeProduct.upc)}>
                            Delete
                        </Button>

                        {!storeProduct.promotional_product
                            &&
                            <Button className="buttonWithMargins" size="sm" color="success"
                                onClick={() => setPromStoreProductAttributes(storeProduct)}>
                            Create promotional
                        </Button>
                        }
                    </ButtonGroup>
                </td>
            }
        </tr>
    });

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Categories",
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/store-products/new">
                            Add Store Product
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" onClick={generatePDF}>
                            Print
                        </Button>
                    }
                </div>

                <div ref={componentPDF}>
                    <h1>Store Products</h1>

                    <div className='search-container noPrint'>
                        <Input
                            style={{width: '200px' }}
                            type="text"
                            placeholder="Find more info by UPC"
                            value={searchUPC}
                            onChange={handleSearchInputChange}
                        />
                        <Button color="primary" onClick={() => showStoreProductDetails()}>Search</Button>
                    </div>

                        <Dropdown className="noPrint" isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret>Sort</DropdownToggle>
                            <DropdownMenu>
                                { auth?.role === "MANAGER"
                                    &&
                                    <DropdownItem onClick={() => toggleSort('num')}>all by number</DropdownItem>
                                }
                                { auth?.role === "CASHIER"
                                    &&
                                    <DropdownItem onClick={() => toggleSort('name')}>all by name</DropdownItem>
                                }
                                <DropdownItem onClick={() => toggleSort('promNum')}>promotional by number</DropdownItem>
                                <DropdownItem onClick={() => toggleSort('promName')}>promotional by name</DropdownItem>
                                <DropdownItem onClick={() => toggleSort('notPromNum')}>not promotional by number</DropdownItem>
                                <DropdownItem onClick={() => toggleSort('notPromName')}>not promotional by name</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    {showEmpty ?
                        <div className="text-center">
                            <p>No results found.</p>
                        </div>
                        :
                        <Table className="mt-4">
                            <thead>
                            <tr>
                                <th>UPC</th>
                                <th>Promotional product UPC</th>
                                <th>Product</th>
                                <th>Selling Price</th>
                                <th>Products number</th>
                                <th>Is promotional?</th>
                                { auth?.role === "MANAGER" && <th>Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {storeProductList}
                            </tbody>
                        </Table>
                    }
                </div>

                <Modal isOpen={storeProductDetails} toggle={toggleStoreProductDetailsModal}>
                    <ModalHeader toggle={toggleStoreProductDetailsModal}>Store Product Details</ModalHeader>
                    <ModalBody>
                        {productDetails && (
                            <>
                                <p>Name: {productDetails?.product_name}</p>
                                { auth?.role === "MANAGER" && <p>Characteristics: {productDetails?.characteristics}</p>}
                                <p>Products number: {productDetails?.products_number}</p>
                                <p>Selling price: {productDetails?.selling_price}</p>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleStoreProductDetailsModal}>Close</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={promStoreProductModalOpen} toggle={togglePromStoreProductModal}>
                    <ModalHeader toggle={togglePromStoreProductModal}>Promotional Store Product</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="products_number">Products Number</Label>
                            <Input
                                type="number"
                                name="products_number"
                                id="products_number"
                                required
                                onChange={handlePromStoreProductNumberChange}
                                autoComplete="products_number"
                            />
                        </FormGroup>
                        <Button color="secondary" onClick={createPromStoreProduct}>Create</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={togglePromStoreProductModal}>Close</Button>
                    </ModalFooter>
                </Modal>

            </Container>
        </div>
    );
};

export default StoreProductList;