import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../service/UserService";

function Navbar() { 
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();

    const handleLogout = (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            setIsTransitioning(true);
            UserService.logout();
            setTimeout(() => {
                window.location.href = '/login';
            }, 300);
        }
    };

    return(
        <nav className={isTransitioning ? 'fade-out' : ''}>
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

