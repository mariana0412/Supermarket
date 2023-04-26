import {Button, ButtonGroup} from "reactstrap";
import React from "react";

const Check = ({ auth, check, cashierName, customerName, remove, showPurchasedProducts }) => {
    const printDate = new Date(check.print_date);
    const formattedDate = `${printDate.getDate().toString().padStart(2, '0')}-${(printDate.getMonth() + 1).toString().padStart(2, '0')}-${printDate.getFullYear()} 
    ${printDate.getHours().toString().padStart(2, '0')}:${printDate.getMinutes().toString().padStart(2, '0')}:${printDate.getSeconds().toString().padStart(2, '0')}`;

    return (
        <tr key={check.check_number}>
            <td>{cashierName}</td>
            <td>{customerName}</td>
            <td>{formattedDate}</td>
            <td>{check.sum_total} ₴</td>
            <td>{check.vat} ₴</td>
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