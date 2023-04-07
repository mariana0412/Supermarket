import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from "./Category/CategoryList";
import CategoryEdit from './Category/CategoryEdit';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path='/categories' exact={true} element={<CategoryList/>}/>
          <Route path='/categories/:id' element={<CategoryEdit/>}/>
        </Routes>
      </Router>
  )
}

export default App;