import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import UserService from "../service/UserService";

function UpdateUser(){
    const navigate = useNavigate();
    const {userId} = useParams();

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        role: "",
        city: ""
    });

    useEffect(() => {
        fetchUserDataById(userId);
    }, [userId]);

    const fetchUserDataById = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await UserService.getUserById(userId, token);
            const {name, email, role, city} = response.ourUsers;
            setUser({name, email, role, city});
        } catch (error) {
            console.error("Error fetching user data:", error);
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
        if (isSubmitting) return;
        
        try {
            const confirmDelete = window.confirm("Are you sure you want to update this user?");
            if (confirmDelete) {
                const token = localStorage.getItem("token");
                await UserService.updateUser(userId, userData, token);
                navigate("/admin/user-management");
            }
            
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error)
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
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label >Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label >City:</label>
                    <input
                        type="text"
                        name="city"
                        value={userData.city}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update User'}
                </button>
            </form>
        </div>
    )

}