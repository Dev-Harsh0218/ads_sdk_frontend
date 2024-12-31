import "./App.css";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import AddAdsHandleData from "./AdsHandleData";
import BulkImageUpload from "./BulkImageUpload";
import { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { IoReload } from "react-icons/io5";

function App() {
  const [hardRefresh,setHardRefresh] = useState(0);
  const handleHardrefresh = () => {
    setHardRefresh(hardRefresh+1);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="w-full relative">
            <div onClick={handleHardrefresh} className="absolute right-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2">Hard refresh <IoReload/></button>
            </div>
            <Toaster position="top-center"/>
            <AddAdsHandleData hardRefresh={hardRefresh}/>
          </div>
        }/>
        <Route path="/harshApp24/bulk-image-upload" element={<BulkImageUpload/>}/>
      </Routes>     
    </BrowserRouter>
  );
}

export default App;
