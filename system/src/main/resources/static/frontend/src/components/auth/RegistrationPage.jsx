import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../service/UserService";

function RegistrationPage(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        city: ""
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // Calls register method from userservice
            const token = localStorage.getItem('token');
            await UserService.register(formData, token);
            
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "",
                city: ""
            });

            alert("Registration successful! You can now log in.");
            // navigate("/login");
            navigate('/admin/user-management');


        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        }
    }

    return(
        <>
            <div className="auth-container">
                <h2>Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label >Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
                    </div>

                    <div className="form-group">
                        <label >Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required/>
                    </div>

                    <div className="form-group">
                        <label >Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required/>
                    </div>

                    <div className="form-group">
                        <label >Role:</label>
                        <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="Enter role..." required/>
                    </div>

                    <div className="form-group">
                        <label>City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city..." required/>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        
        </>
    )

}

export default RegistrationPage;