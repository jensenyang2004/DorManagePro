import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication on initial load
        setLoading(true)
        try {
            checkAuthentication();
        }catch{

        }finally{
            setLoading(false)
        }
    }, [user]);

    const checkAuthentication = async () => {
        try {
            const response = await fetch('http://localhost:8888/api/user', {
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
            setLoading(false);
        } catch (error) {
            console.error('Authentication check failed:', error);
            setUser(null);
            setLoading(false);
        }
    };
    const login = async (student_id, ssn) => {
        try {
            // Make POST request to backend to authenticate the user
            // console.log('開始發送登入請求...');
            const response = await fetch('http://localhost:8888/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for sending cookies (JWT token)
                body: JSON.stringify({ student_id, ssn }), // Sending data to backend
            });
            // 新增：記錄響應狀態
            // console.log('Response status:', response.status);
    
            if (response.ok) {
                // If login is successful, process the response
                const userData = await response.json();
                console.log(userData);
                // Optionally, trigger authentication check to load user data
                await checkAuthentication();
    
                // Inform that login was successful
                return true;
            } else {
                // If login failed, throw an error with specific message
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(`Login failed: ${error.message}`); // Provide the error message to the user
            return false;
        }
    };

    const logout = async () => {
        try {
            // Optional: Implement a backend logout endpoint to invalidate token
            await fetch('http://localhost:8888/api/logout', { 
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading,
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);