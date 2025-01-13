import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import ListWeddingDress from './components/salon/ListWeddingDress';  
import Post from './components/salon/Post';
import Search from './components/Search';




function App() {
  return (
    <div className=''>
      <Routes>
        <Route path='/registration' element = {<Registration/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path = '/navbar' element = {<Navbar/>}/>
        <Route path = '/admin_dashboard' element = {<AdminDashboard/>}/>
        <Route path = '/post' element = {<Post/>}/>
        <Route path = '/dress' element = {<ListWeddingDress/>}/>
        <Route path = '/search' element= {<Search/>}/>
      </Routes>

    </div>
  );
}

export default App;
