import React, { useRef } from 'react';
import { LoginToken } from '../App';

interface LoginProps {
    setLoginToken: (loginToken: LoginToken) => void
}

const Login: React.FC<LoginProps> = ({ setLoginToken }) => {
    // Create refs to access the username and password fields
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault(); // Prevent form reload

        // Access the values of the input fields using refs
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            alert('Both fields are required!');
            return;
        }

        const credentials = { username, password };

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            // Handle the response
            const data = await response.json();

            if (response.ok) {
                const token: LoginToken = {
                    token: data.id,
                    perms: data.permissions
                }
                setLoginToken(token)
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred!');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" ref={usernameRef} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" ref={passwordRef} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;