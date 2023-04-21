import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React from "react";

const SearchBySurnameModal = ({ isOpen, toggle, customers}) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} products={customers}>
            <ModalHeader toggle={toggle}>Products</ModalHeader>
            <ModalBody>
                {customers && customers.map(customer => (
                    <div key={customer.card_number}>
                        <p>Surname: {customer.cust_surname}</p>
                        <p>Name: {customer.cust_name}</p>
                        { customer?.cust_patronymic && <p>Patronymic: {customer.cust_patronymic}</p>}
                        <p>Phone number: {customer.phone_number}</p>
                        { customer?.city && <p>City: {customer.city}</p> }
                        { customer?.street && <p>Street: {customer.street}</p> }
                        { customer?.zip_code && <p>Zip-code: {customer.zip_code}</p> }
                        <p>Sale percent: {customer.percent}</p>
                    </div>
                ))}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

export default SearchBySurnameModal;