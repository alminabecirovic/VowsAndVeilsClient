import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import ListWeddingDress from "./components/salon/ListWeddingDress";
import Post from "./components/salon/Post";
import Search from "./components/Search";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      {/* Dodata Navigation komponenta koja će biti prikazana na svim rutama */}
      <Navbar />

      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/post" element={<Post />} />
        <Route path="/dress" element={<ListWeddingDress />} />
        <Route path="/search" element={<Search />} />
        <Route path="/nav" element={<Navbar />} />
      </Routes>
    </div>
  );
}

export default App;

