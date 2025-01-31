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
import Home from "./components/Home";
import Footer from "./components/Footer";
import Navbar3 from "./components/Navbar3";
import AppointmentPage from "./components/salon/AppointmentPage";
import Navbar4 from "./components/Navbar4";
import CreateInspiration from "./components/user/CreateInspiration";
import InspirationPage from "./components/InspirationPage";
import ApprovedInspirationsPage from "./components/ApprovedInspirationsPage";
function App() {
  const location = useLocation();
  const [criteria, setCriteria] = useState({ dressLength: "", size: "" });

  // Rute na kojima treba prikazati Navbar2
  const showNavbar2Routes = ["/user_dresses_list", "/inspiration", "/search", "/login", "/registration"];
  const showNavbar2 = showNavbar2Routes.includes(location.pathname);

  // Rute na kojima treba prikazati Navbar3
  const showNavbar3Routes = ["/dress", "/appointments" ];
  const showNavbar3 = showNavbar3Routes.includes(location.pathname);

  const showNavbar4Routes = ["/admin_dashboard", "/inspiration-page" ];
  const showNavbar4 = showNavbar4Routes.includes(location.pathname);

  return (
    <div>
      <Navbar />

      {/* Navbar2 koji se prikazuje samo na određenim stranicama */}
      {showNavbar2 && <Navbar2 onCriteriaChange={setCriteria} />}
      
      {/* Navbar3 koji se prikazuje samo na određenim stranicama */}
      {showNavbar3 && <Navbar3 />}
      {showNavbar4 && <Navbar4 />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/post" element={<Post />} />
        <Route path="/dress" element={<ListWeddingDress />} />
        <Route path="/user_dresses_list" element={<UserDressesList criteria={criteria} />} />
        <Route path="/fav" element={<Favorites />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/dress-details/:dressId" element={<DressDetails />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/inspiration" element={<CreateInspiration />} />
        <Route path="/inspiration-page" element={<InspirationPage />} />
        <Route path="/approved" element={<ApprovedInspirationsPage />} />
        
        <Route path="/footer" element={<Footer />} />
       

      </Routes>

      <Footer />
    </div>
  );
}

export default App;
