import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React from "react";

const SearchByNameModal = ({ isOpen, toggle, products}) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} products={products}>
            <ModalHeader toggle={toggle}>Products</ModalHeader>
            <ModalBody>
                {products && products.map(product => (
                    <div key={product.id_product}>
                        <p>Name: {product.product_name}</p>
                        <p>Producer: {product.producer}</p>
                        <p>Characteristics: {product.characteristics}</p>
                    </div>
                ))}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

export default SearchByNameModal;