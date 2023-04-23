import {Button, ButtonGroup} from "reactstrap";
import React from "react";

const Check = ({ auth, check, cashierName, customerName, remove, showPurchasedProducts }) => {
    return (
        <tr key={check.check_number}>
            <td>{check.check_number}</td>
            <td>{cashierName}</td>
            <td>{customerName}</td>
            <td>{check.print_date}</td>
            <td>{check.sum_total}</td>
            <td>{check.vat}</td>
            <td>
                <ButtonGroup>
                    { auth?.role === "MANAGER" &&
                        <Button className="buttonWithMargins" size="sm" color="danger"
                                onClick={() => remove(check.check_number)}>
                            Delete
                        </Button>
                    }
                    <Button className="buttonWithMargins" size="sm" color="primary"
                            onClick={() => showPurchasedProducts(check.check_number)}>
                        View Details
                    </Button>
                </ButtonGroup>
            </td>
        </tr>
    );
};

export default Check;