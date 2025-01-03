import React, { useState } from "react";

const TestSignUp = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div
        className={`relative w-full max-w-4xl min-h-[480px] bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-500 ${
          isRightPanelActive ? "translate-x-0" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-500 ${
            isRightPanelActive ? "translate-x-full" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h1 className="font-bold text-2xl">Create Account</h1>
            <div className="flex space-x-4 mt-4">
              <button className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                <i className="fab fa-facebook-f text-gray-600"></i>
              </button>
              <button className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                <i className="fab fa-google-plus-g text-gray-600"></i>
              </button>
              <button className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                <i className="fab fa-linkedin-in text-gray-600"></i>
              </button>
            </div>
            <p className="text-gray-500 mt-4">or use your email for registration</p>
            <form className="flex flex-col items-center w-full space-y-4 mt-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-3 rounded-md uppercase font-bold tracking-wide"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-500 ${
            isRightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h1 className="font-bold text-2xl">Sign in</h1>
            <div className="flex space-x-4 mt-4">
              <button className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                <i className="fab fa-facebook-f text-gray-600"></i>
              </button>
              <button className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                <i className="fab fa-google-plus-g text-gray-600"></i>
              </button>
              <button className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                <i className="fab fa-linkedin-in text-gray-600"></i>
              </button>
            </div>
            <p className="text-gray-500 mt-4">or use your account</p>
            <form className="flex flex-col items-center w-full space-y-4 mt-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
              <button type="button" className="text-red-500 hover:underline text-sm">
                Forgot your password?
              </button>
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-3 rounded-md uppercase font-bold tracking-wide"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center transform transition-transform duration-500 ${
            isRightPanelActive ? "-translate-x-1/2" : ""
          }`}
        >
          <div>
            <h1 className="text-3xl font-bold">
              {isRightPanelActive ? "Welcome Back!" : "Hello, Friend!"}
            </h1>
            <p className="mt-4">
              {isRightPanelActive
                ? "To keep connected with us please login with your personal info"
                : "Enter your personal details and start your journey with us"}
            </p>
            <button
              onClick={isRightPanelActive ? handleSignInClick : handleSignUpClick}
              className="mt-6 px-6 py-3 bg-white text-red-500 rounded-md uppercase font-bold"
            >
              {isRightPanelActive ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSignUp;
