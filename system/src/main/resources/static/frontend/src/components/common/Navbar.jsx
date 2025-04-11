import React from "react";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";

function Navbar() { 
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();
    // const isUser = UserService.isUser();

    const handleLogout = () => {
        const confirmDelete = window.confirm("Are you sure you want to log out?");
        if (confirmDelete) {
            UserService.logout();
            window.location.reload(); // Reload the page after logout
        }
    };


    return(
        <nav>
            <ul>
                {!isAuthenticated && <li><Link to="/">Phegen Deb</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
        </nav>
        
    );

}

export default Navbar;

