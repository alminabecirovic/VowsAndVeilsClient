import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navbar2 from "./components/Navbar2";
import Registration from "./components/Registration";
import Login from "./components/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDressesList from "./components/UserDressesList";
import Favorites from "./components/user/Favorites";
import Appointment from "./components/user/Appointment";
import DressDetails from "./components/DressDetails";
import Home from "./components/Home";
import Footer from "./components/Footer";
import AppointmentPage from "./components/salon/AppointmentPage";
import CreateInspiration from "./components/user/CreateInspiration";
import InspirationPage from "./components/admin/InspirationPage";
import ApprovedInspirationsPage from "./components/ApprovedInspirationsPage";
import StoryInspiration from "./components/StoryInspiration";
import VerifyAccount from "./components/VerifyAccount";
import Post from "./components/salon/Post"
import ListWeddingDress from "./components/salon/ListWeddingDress"
function App() {
  const location = useLocation();
  const [criteria, setCriteria] = useState({ dressLength: "", size: "" });

  const showNavbar2Routes = [
    "/user_dresses_list",
    "/inspiration",
    "/search",
    "/login",
    "/registration",
    "/story",
    "/approved",
    "/dress",
    "/appointments",
    "/admin_dashboard",
    "/inspiration-page",
    "/fav",
    "/appointment"
  ];

  const showNavbar2 = showNavbar2Routes.some(route => location.pathname.startsWith(route));

  console.log("Trenutna ruta:", location.pathname);
  console.log("Treba li da se Navbar2 prikaže?", showNavbar2);

  return (
    <div>
      <Navbar />
      {showNavbar2 && <Navbar2 onCriteriaChange={setCriteria} />}
      <div style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/user_dresses_list" element={<UserDressesList criteria={criteria} />} />
          <Route path="/fav" element={<Favorites />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/dress-details/:dressId" element={<DressDetails />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/inspiration" element={<CreateInspiration />} />
          <Route path="/inspiration-page" element={<InspirationPage />} />
          <Route path="/approved/:id" element={<ApprovedInspirationsPage />} />
          <Route path="/story" element={<StoryInspiration />} />
          <Route path="verify_your_account" element={<VerifyAccount/>}/>
          <Route path="/post" element={<Post/>}/>
          <Route path="/dress" element={<ListWeddingDress/>}/>
        </Routes>
        </div>
      <Footer />
    </div>
  );
}

export default App;
