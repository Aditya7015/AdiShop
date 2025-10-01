import React, { useContext, useState } from 'react';
import demo_image from '../assets/demo_image.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
const apiUrl = import.meta.env.VITE_API_URL;
import toast from 'react-hot-toast';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${apiUrl}/users/login`, {
            email,
            password
        });

        // Update global auth state
        login(response.data);

        console.log('Login successful:', response.data);

        // Redirect to home or dashboard
        navigate('/');
    } catch (err) {
    console.error(err.response?.data?.message || err.message);
    toast.error(err.response?.data?.message || 'Login failed');
}
};


    return (
        <div className="flex h-screen w-full">
            <div className="w-full hidden md:inline-block">
                <img className="h-full w-full object-cover" src={demo_image} alt="leftSideImage" />
            </div>

            <div className="w-full flex flex-col items-center justify-center bg-white p-4">
                <form className="md:w-96 w-full max-w-sm flex flex-col items-center justify-center p-4" onSubmit={handleSubmit}>
                    <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
                    <p className="text-sm text-gray-500/90 mt-3 text-center">Welcome back! Please sign in to continue</p>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {/* Email Input */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-5">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                        </svg>
                        <input
                            type="email"
                            placeholder="Email id"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-4"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                        </svg>
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-4"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity">
                        Login
                    </button>
                    <p className="text-gray-500/90 text-sm mt-4">Don’t have an account? 
                        <Link to='/signup' className='text-indigo-400 hover:underline'>Sign up</Link> 
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
