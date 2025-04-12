import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);
        
        try {
            const userData = await UserService.login(email, password);
            if (userData?.token) {
                localStorage.setItem("token", userData.token);
                localStorage.setItem("role", userData.role);
                setIsTransitioning(true);
                setTimeout(() => {
                    window.location.replace('/profile');
                }, 300);
            } else {
                setError("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "An error occurred during login");
            setTimeout(() => {
                setError("");
            }, 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`auth-container ${isTransitioning ? 'fade-out' : ''} ${isSubmitting ? 'submitting' : ''}`}>
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting || isTransitioning}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting || isTransitioning}
                    />
                </div>
                <button type="submit" disabled={isSubmitting || isTransitioning}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;