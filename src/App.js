import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import AddAdsHandleData from "./AdsHandleData";
import BulkImageUpload from "./BulkImageUpload";
import { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { IoReload } from "react-icons/io5";
import SignUp from "./Signup";
import SignIn from "./SignIn";

const isValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  try {
    if (!token.startsWith('Bearer ')) return false;
    const actualToken = token.split('Bearer ')[1];
    const tokenParts = actualToken.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    console.log(payload);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};


const ProtectedRoute = ({ children }) => {
  return isValidToken() ? children : <Navigate to="/sign-in" />;
};

const PublicRoute = ({children}) =>{
  return isValidToken() ? <Navigate to="/"/> : children
}

function App() {
  const [hardRefresh, setHardRefresh] = useState(0);
  
  const handleHardrefresh = () => {
    setHardRefresh(hardRefresh + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>} />
        <Route path="/sign-up" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>}/>
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <div className="w-full relative">
              <div onClick={handleHardrefresh} className="absolute right-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2">
                  Hard refresh <IoReload/>
                </button>
              </div>
              <Toaster position="top-center"/>
              <AddAdsHandleData hardRefresh={hardRefresh}/>
            </div>
          </ProtectedRoute>
        }/>
        
        <Route path="/harshApp24/bulk-image-upload" element={
          <ProtectedRoute>
            <BulkImageUpload/>
          </ProtectedRoute>
        }/>

        {/* Catch all route - redirect to sign-in */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>     
    </BrowserRouter>
  );
}

export default App;
