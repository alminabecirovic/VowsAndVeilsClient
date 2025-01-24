import React, { useState } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import ListWeddingDress from "./components/salon/ListWeddingDress";
import Post from "./components/salon/Post";
import Navbar from "./components/Navbar";
import UserDressesList from "./components/UserDressesList";
import Favorites from "./components/user/Favorites";
import Navbar2 from "./components/Navbar2";
import Appointment from "./components/user/Appointment";
import DressDetails from "./components/DressDetails";

function App() {
  const location = useLocation();
  const [criteria, setCriteria] = useState({ dressLength: "", size: "" });

  // Rute na kojima treba prikazati Navbar2
  const showNavbar2Routes = ["/user_dresses_list", "/inspiration", "/search", "/login", "/registration"];
  const showNavbar2 = showNavbar2Routes.includes(location.pathname);

  return (
    <div>
      {/* Navbar koji se prikazuje na svim stranicama */}
      <Navbar />
      
      {/* Navbar2 koji se prikazuje samo na određenim stranicama */}
      {showNavbar2 && <Navbar2 onCriteriaChange={setCriteria} />}

      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/post" element={<Post />} />
        <Route path="/dress" element={<ListWeddingDress />} />
        <Route path="/user_dresses_list" element={<UserDressesList criteria={criteria} />} />
        <Route path="/fav" element={<Favorites />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/dress-details/:dressId" element={<DressDetails />} />
      </Routes>
    </div>
  );
}

export default App;
