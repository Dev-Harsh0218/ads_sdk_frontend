import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { serverUrl } from "./const";

const ImageUpload = ({onUploadSuccess}) => {
  const fileInputRef = useRef(null);
  const [formData, setformDataState] = useState({
    selectedFile: null,
    imageUrl: "",
    packageUrl: "",
    isbanner: 0,
    closeBtnColor: 0,
  });

  const resetForm = () => {
    setformDataState({
      selectedFile: null,
      imageUrl: "",
      packageUrl: "",
      isbanner: 0,
      closeBtnColor: 0,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setformDataState(prev => ({
      ...prev,
      selectedFile: file,
      imageUrl: URL.createObjectURL(file)
    }));
  };

  //   const adsDataList = [
  //     [false, 'com.as.speakercleaner-2.png', 'https://play.google.com/store/apps/details?id=com.as.speakercleaner&hl=en-IN'],
  //     [false, 'com.as.speakercleaner.png', 'https://play.google.com/store/apps/details?id=com.as.speakercleaner&hl=en-IN'],
  //     [true, 'com.clock.sandtimer-1.png', 'https://play.google.com/store/apps/details?id=com.clock.sandtimer&hl=en-IN'],
  //     [true, 'com.clock.sandtimer.png', 'https://play.google.com/store/apps/details?id=com.clock.sandtimer&hl=en-IN'],
  //     [false, 'com.meditation.medit7-1.png', 'https://play.google.com/store/apps/details?id=com.meditation.medit8&hl=en-IN'],
  //     [false, 'com.meditation.medit7-2.png', 'https://play.google.com/store/apps/details?id=com.meditation.medit8&hl=en-IN'],
  //     // [false, 'com.walli.hd.wallpapervideo.mp3', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
  //     // [false, 'commeditationmedit7video.mp4', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
  //     [false, 'com.meditation.medit7.png', 'https://play.google.com/store/apps/details?id=com.meditation.medit8&hl=en-IN'],
  //     [false, 'com.music.focusflow-2.png', 'https://play.google.com/store/apps/details?id=com.music.focusflow&hl=en-IN'],
  //     [false, 'com.music.focusflow.png', 'https://play.google.com/store/apps/details?id=com.music.focusflow&hl=en-IN'],
  //     [true, 'com.walli.hd.wallpaper0.png', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
  //     [true, 'com.walli.hd.wallpaper1.png', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
  //     [true, 'com.walli.hd.wallpaper2.png', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN']
  // ];

  // const handleUpload = async () =>{
  //   try {
  //     const response = await axios.post(
  //       `http://${serverUrl}/api/v1/ads/upload-multiple-ads`,
  //       { adsData : adsDataList },
  //       {
  //         headers:{
  //           "content-Type" : "application/json"
  //         },
  //       }
  //     );
  //     if(response.status ===200){
  //       toast.success('Files uploaded successfully here');
  //     }
  //     else{
  //       toast.error(`Something went wrong ${response.data}`)
  //     }
  //   } catch (error){
  //     console.error('Error uploading files:', error);
  //     alert(error);
  //   }
  // }

  const handleUpload = async () => {
    if (!formData.selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const uploadedData = new FormData();
    uploadedData.append("image", formData.selectedFile);
    uploadedData.append("appUrl", formData.packageUrl);
    uploadedData.append("isWhite", formData.closeBtnColor);
    uploadedData.append("isBanner", formData.isbanner);
    try {
      await axios.post(
        `http://${serverUrl}/api/v1/ads/upload-ad`,
        uploadedData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success('File uploaded successfully');
      resetForm();
      onUploadSuccess();
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="">
      <h2>Upload Image</h2>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} />
      <div className="mt-6">
        <div className="my-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Close button color:</label>
          {['Light', 'Dark'].map((label, index) => (
            <div key={label} className="flex items-center gap-5">
              <input
                type="radio"
                name="closeBtnColor"
                checked={formData.closeBtnColor === index}
                onChange={() => setformDataState(prev => ({...prev, closeBtnColor: index}))}
              />
              <label>{label}</label>
            </div>
          ))}
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2">App Redirection URL:</label>
        <input
          type="text"
          placeholder="Enter package URL"
          value={formData.packageUrl}
          onChange={(e) => setformDataState(prev => ({...prev, packageUrl: e.target.value}))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center gap-5 mt-4">
        <input
          type="checkbox"
          onChange={() => setformDataState(prev => ({...prev, isbanner: prev.isbanner ? 0 : 1}))}
        />
        <label>Banner</label>
      </div>
      <button
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleUpload}
      >
        Upload
      </button>
      {formData.imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={formData.imageUrl} alt="Uploaded" style={{ maxWidth: "100px" }} />
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default ImageUpload;

