import React, { useState } from 'react';
import {Toaster,toast} from 'react-hot-toast';
import {Link,useNavigate} from 'react-router-dom';
import {FaEye,FaEyeSlash} from 'react-icons/fa'
import {serverUrl} from './const'
const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword,setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }
    //
    setError('');
    try {
      const response = await fetch(`http://${serverUrl}/api/v1/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token',`Bearer ${data.refreshToken}`);
        localStorage.setItem('userData',JSON.stringify(data.user));
        // setSuccessMessage('Sign in successful!');
        navigate('/')
        toast.success('Sign in successful!');
        
        setFormData({ email: '', password: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Toaster position='top-center'/>
      <div className="max-w-md w-full p-8 bg-gray-50 rounded-xl shadow-2xl flex flex-col space-y-6">
        <h2 className="text-3xl font-semibold text-center text-gray-700">Sign In</h2>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-600 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-600 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/Sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;