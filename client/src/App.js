import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from "./Category/CategoryList";
import CategoryEdit from './Category/CategoryEdit';
import EmployeeList from "./Employee/EmployeeList";
import EmployeeEdit from "./Employee/EmployeeEdit";
import ProductList from "./Product/ProductList";
import ProductEdit from "./Product/ProductEdit";
import CustomerCardList from "./CustomerCard/CustomerCardList";
import CustomerCardEdit from "./CustomerCard/CustomerCardEdit";
import StoreProductList from "./StoreProduct/StoreProductList";
import StoreProductEdit from "./StoreProduct/StoreProductEdit";
import CheckList from "./Check/CheckList";

const App = () => {
  return (
      <Router>
        <Routes>
            <Route exact path="/" element={<Home/>}/>

            <Route path='/categories' exact={true} element={<CategoryList/>}/>
            <Route path='/categories/:id' element={<CategoryEdit/>}/>

            <Route path='/employees' exact={true} element={<EmployeeList/>}/>
            <Route path='/employees/:id' element={<EmployeeEdit/>}/>

            <Route path='/customer-cards' exact={true} element={<CustomerCardList/>}/>
            <Route path='/customer-cards/:id' exact={true} element={<CustomerCardEdit/>}/>

            <Route path='/products' exact={true} element={<ProductList/>}/>
            <Route path='/products/:id' exact={true} element={<ProductEdit/>}/>

            <Route path='/store-products' exact={true} element={<StoreProductList/>}/>
            <Route path='/store-products/:id' exact={true} element={<StoreProductEdit/>}/>

            <Route path='/checks' exact={true} element={<CheckList/>}/>
        </Routes>
      </Router>
  )
}

export default App;