import "./App.css";
import { Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import AddAdsHandleData from "./AdsHandleData";
import BulkImageUpload from "./BulkImageUpload";
import { Toaster } from 'react-hot-toast';
import { IoReload ,IoLogOutOutline,IoNotifications,IoPersonCircleSharp} from "react-icons/io5";
import { useState } from "react";
import SignUp from "./Signup";
import SignIn from "./SignIn";
import GetDetailedAnalysis from "./GetDetailedAnalysis";
import AccountApproval from "./AccountApproval";
import TestSEE from "./TestSSE";

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
  const [isNotifyPresent,setIsNotifyPresent] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.history.pushState({}, '', '/sign-in');
    window.location.href = '/sign-in';
  };  
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
              <div className="absolute right-4 flex items-center justify-center gap-8">
                <button onClick={handleHardrefresh} title="Refresh all data" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2">
                  Hard refresh <IoReload/>
                </button>
                <div className="relative flex items-center justify-center">
                  { isNotifyPresent && 
                  <div className="absolute left-3 bottom-3 w-[5px] h-[5px] rounded-full bg-red-600"></div>
                   }
                  <IoNotifications/>
                </div>
                <IoPersonCircleSharp className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800"/>
                <IoLogOutOutline 
                title="Logout"
                onClick={handleLogout}
                className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
                />
              </div>
              <AddAdsHandleData hardRefresh={hardRefresh}/>
              <Toaster position="top-center"/>
            </div>
          </ProtectedRoute>
        }/>
        <Route path="/detailed-analytics" element={
          <ProtectedRoute>
            <GetDetailedAnalysis/>
          </ProtectedRoute>
        }/>
        <Route path="/account-approval" element={
          <ProtectedRoute>
            <AccountApproval/>
          </ProtectedRoute>
        }/>
        <Route path="/bulk-image-upload" element={
          <ProtectedRoute>
            <BulkImageUpload/>
          </ProtectedRoute>
        }/>

        <Route path="/test-sse" element={
          <ProtectedRoute>
            <TestSEE/>
          </ProtectedRoute>
        }/>
        {/* Catch all route - redirect to sign-in */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>     
    </BrowserRouter>
  );
}

export default App;
