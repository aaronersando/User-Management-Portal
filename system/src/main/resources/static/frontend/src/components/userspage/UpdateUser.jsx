import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import UserService from "../service/UserService";

function UpdateUser(){
    const navigate = useNavigate();
    const {userId} = useParams();
    const isAdmin = UserService.isAdmin();
    const [originalEmail, setOriginalEmail] = useState("");

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        role: "",
        city: ""
    });

    useEffect(() => {
        if (!UserService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchUserDataById(userId);
    }, [userId, navigate]);

    const fetchUserDataById = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = isAdmin ? 
                await UserService.getUserById(userId, token) :
                await UserService.getYourProfile(token);
            const {name, email, role, city} = response.ourUsers;
            setUserData({name, email, role, city});
            setOriginalEmail(email);
        } catch (error) {
            console.error("Error fetching user data:", error);
            if (error.response?.status === 403) {
                UserService.logout();
                window.location.replace('/login');
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const confirmUpdate = window.confirm("Are you sure you want to update this user?");
            if (confirmUpdate) {
                const token = localStorage.getItem("token");
                const isEmailChanged = userData.email !== originalEmail;

                if (isAdmin) {
                    await UserService.updateUser(userId, userData, token);
                    navigate("/admin/user-management");
                } else {
                    if (isEmailChanged) {
                        // When email is changed:
                        // 1. Update the user
                        await UserService.updateOwnProfile(userId, userData, token);
                        // 2. Clear auth state
                        UserService.logout();
                        // 3. Force redirect and refresh
                        window.location.replace('/login');
                        return;
                    } else {
                        await UserService.updateOwnProfile(userId, userData, token);
                        navigate("/profile");
                    }
                }
            }
        } catch (error) {
            console.error("Error updating user:", error);
            if (error.response?.status === 403) {
                UserService.logout();
                window.location.replace('/login');
            } else {
                alert("Error updating profile: " + error.message);
            }
        }
    };

    return(
        <div className="auth-container">
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        disabled={!isAdmin} // Only admin can change roles
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={userData.city}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit">Update User</button>
            </form>
        </div>
    )
}

export default UpdateUser;