import React, {useState, useEffect} from "react";
import UserService from "../service/UserService";
import {Link, useNavigate} from "react-router-dom";

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});
    const isAdmin = UserService.isAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        if (!UserService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchProfileInfo();
    }, [navigate])

    const fetchProfileInfo = async () => { 
        try {
            const token = localStorage.getItem("token");
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.ourUsers);
        } catch (error) {
            console.log("Error fetching profile info:", error);
            if (error.response?.status === 403) {
                UserService.logout();
                window.location.replace('/login');
            }
        }
    };

    return(
        <div className="profile-page-container">
            <h2>Profile Information</h2>
            <p>Name: {profileInfo.name}</p>
            <p>Email: {profileInfo.email}</p>
            <p>City: {profileInfo.city}</p>
            <p>Role: {profileInfo.role}</p>
            <button><Link to={`/update-user/${profileInfo.id}`}>Update This Profile</Link></button>
        </div>
    )
}

export default ProfilePage;
