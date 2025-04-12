import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import UserService from "../service/UserService";

function UpdateUser(){
    const navigate = useNavigate();
    const {userId} = useParams();
    const isAdmin = UserService.isAdmin();
    const [originalEmail, setOriginalEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                navigate('/login');
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        const confirmUpdate = window.confirm("Are you sure you want to update this user?");
        if (!confirmUpdate) return;

        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        const isEmailChanged = userData.email !== originalEmail;

        try {
            if (isAdmin) {
                await UserService.updateUser(userId, userData, token);
                navigate("/admin/user-management");
            } else {
                if (isEmailChanged) {
                    await UserService.updateOwnProfile(userId, userData, token);
                    UserService.logout();
                    window.location.href = '/login';
                } else {
                    await UserService.updateOwnProfile(userId, userData, token);
                    navigate("/profile");
                }
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setIsSubmitting(false);
            if (error.response?.status === 403) {
                UserService.logout();
                window.location.href = '/login';
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
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        disabled={!isAdmin || isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
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
    );
}

export default UpdateUser;