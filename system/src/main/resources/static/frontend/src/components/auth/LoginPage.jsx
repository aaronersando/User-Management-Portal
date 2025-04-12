import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../service/UserService";

function LoginPage(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        try{
            const userData = await UserService.login(email, password);
            // console.log(userData);
            if(userData){
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                navigate("/profile");
            }else{
                    setError(userData.error);
            }
        }catch(error){
            console.error(error);
            setError(error);
            setTimeout(() => {
                setError("");
            // setError("Invalid credentials");
        }, 5000);
    }


    return(
        <>
            <div className="auth-container">   
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label htmlFor="">Email: </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Password: </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        
        </>
        )
    }
}
export default LoginPage;