import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard'; 




function App() {
  return (
    <div className=''>
      <Routes>
        <Route path='/registration' element = {<Registration/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path = '/navbar' element = {<Navbar/>}/>
        <Route path = '/admin_dashboard' element = {<AdminDashboard/>}/>
        
      </Routes>

    </div>
  );
}

export default App;
