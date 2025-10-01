import React, { useState, useContext } from 'react';
import demo_image2 from '../assets/demo_image2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // default role
    const navigate = useNavigate();
    
    // ✅ get login from context
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/users/register`, {
                name,
                email,
                password,
                role
            });

            // Save user data and token in localStorage
            localStorage.setItem('userData', JSON.stringify(response.data));
            localStorage.setItem('userToken', response.data.token);

            // ✅ Update global auth state
            login(response.data);

            console.log('Signup successful:', response.data);

            // Redirect user after signup
            navigate('/');
        } 

catch (err) {
    console.error(err.response?.data?.message || err.message);
    toast.error(err.response?.data?.message || 'Signup failed');
}
    };

    return (
        <div className="flex h-screen w-full">
            <div className="w-full hidden md:inline-block">
                <img className="h-full w-full object-cover" src={demo_image2} alt="leftSideImage" />
            </div>

            <div className="w-full flex flex-col items-center justify-center bg-white p-4">
                <form
                    className="md:w-96 w-full max-w-sm flex flex-col items-center justify-center p-4"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
                    <p className="text-sm text-gray-500/90 mt-3 text-center">
                        Join us! Create your account to start shopping
                    </p>

                    {/* Name */}
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-5">
                        <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-4"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                fill="#6B7280"
                            />
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

                    {/* Password */}
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            />
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

                    {/* Role Selection */}
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full pl-6 pr-4">
                        <svg className="h-4 w-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 100 12 6 6 0 000-12zM8 10a2 2 0 114 0 2 2 0 01-4 0z" />
                        </svg>
                        <select
                            className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
                    >
                        Sign up
                    </button>

                    <p className="text-gray-500/90 text-sm mt-4">
                        Already have an account?
                        <Link to='/login' className='text-indigo-400 hover:underline'> Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
