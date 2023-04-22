import React from "react";
import {Table} from "reactstrap";

const CategoriesTable = ({categories}) => {
    const categoriesInColumns = () => categories.map(category =>
        <tr key={category.category_number}>
            <td>{category.category_number}</td>
            <td>{category.category_name}</td>
        </tr>
    );

    return (
        <div>
            <Table className="mt-4">
                <thead>
                <tr>
                    <tr>Number</tr>
                    <th>Name</th>
                </tr>
                </thead>

                <tbody>
                {categoriesInColumns}
                </tbody>
            </Table>
        </div>
    );
}

export default CategoriesTable;