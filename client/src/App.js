import React from 'react';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from "./components/Category/CategoryList";
import CategoryEdit from './components/Category/CategoryEdit';
import EmployeeList from "./components/Employee/EmployeeList";
import EmployeeEdit from "./components/Employee/EmployeeEdit";
import ProductList from "./components/Product/ProductList";
import ProductEdit from "./components/Product/ProductEdit";
import CustomerCardList from "./components/CustomerCard/CustomerCardList";
import CustomerCardEdit from "./components/CustomerCard/CustomerCardEdit";
import StoreProductList from "./components/StoreProduct/StoreProductList";
import StoreProductEdit from "./components/StoreProduct/StoreProductEdit";
import CheckList from "./components/Check/CheckList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const App = () => {
  return (
      <Router>
        <Routes>
            <Route exact path="/" element={<Home/>}/>

            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/register" element={<Register/>}/>

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