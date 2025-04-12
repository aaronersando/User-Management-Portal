import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import UserService from "../service/UserService";

function UserManagement() { 
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!UserService.isAdmin()) {
            navigate('/profile');
            return;
        }
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await UserService.getAllUsers(token);
            setUsers(response.ourUsersList);
        } catch (error) {
            console.error("Error fetching users:", error);
            if (error.response?.status === 403) {
                navigate('/profile');
            }
        }
    };

    const deleteUser = async (userId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            const token = localStorage.getItem("token");
            if(confirmDelete){
                await UserService.deleteUser(userId, token);
                fetchUsers();
            }
            
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    return(
        <div className="user-management-container">
            <h2>Users Management Page</h2>
            <button className="reg-button"><Link to="/register">Add User</Link></button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
                                <button><Link to={`/update-user/${user.id}`}>Update</Link></button>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>

        </div>
    )

}

export default UserManagement;