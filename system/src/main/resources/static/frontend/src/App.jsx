import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import RegistrationPage from "./components/auth/RegistrationPage";
import ProfilePage from "./components/userspage/ProfilePage";
import UserManagement from "./components/userspage/UserManagement";
import UpdateUser from "./components/userspage/UpdateUser";
import Footer from "./components/common/Footer";
import UserService from "./components/service/UserService";
import LoginPage from "./components/auth/LoginPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());

  useEffect(() => {
    // Update auth state whenever localStorage changes
    const handleStorageChange = () => {
      setIsAuthenticated(UserService.isAuthenticated());
      setIsAdmin(UserService.isAdmin());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return(
    <BrowserRouter>
      <div className="App">
        <Navbar/>
          <div className="content">
            <Routes>
              <Route path="/" element={!isAuthenticated ? <LoginPage/> : <Navigate to="/profile"/>}/>
              <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to="/profile"/>} />
              
              {/* Protected routes */}
              <Route path="/profile" element={isAuthenticated ? <ProfilePage/> : <Navigate to="/login"/>}/> 
              <Route path="/update-user/:userId" element={isAuthenticated ? <UpdateUser/> : <Navigate to="/login"/>} />
              
              {/* Admin-only routes */}
              <Route path="/register" element={isAdmin ? <RegistrationPage/> : <Navigate to="/profile"/>} />
              <Route path="/admin/user-management" element={isAdmin ? <UserManagement/> : <Navigate to="/profile"/>} />
              
              <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"}/>}/>
            </Routes>
          </div>
          <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;













