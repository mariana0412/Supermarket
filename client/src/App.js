import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from "./Category/CategoryList";
import CategoryEdit from './Category/CategoryEdit';
import EmployeeList from "./Employee/EmployeeList";
import EmployeeEdit from "./Employee/EmployeeEdit";

const App = () => {
  return (
      <Router>
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path='/categories' exact={true} element={<CategoryList/>}/>
            <Route path='/categories/:id' element={<CategoryEdit/>}/>
            <Route path='/employees' exact={true} element={<EmployeeList/>}/>
            <Route path='/employees/:id' element={<EmployeeEdit/>}/>
        </Routes>
      </Router>
  )
}

export default App;