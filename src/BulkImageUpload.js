import React from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { serverUrl } from './const';
import { useNavigate } from 'react-router-dom';
const BulkImageUpload = () => {
    const navigate = useNavigate();
    const adsDataList = [
      [false, 'com.as.speakercleaner-2.png', 'https://play.google.com/store/apps/details?id=com.as.speakercleaner&hl=en-IN'],
      [false, 'com.as.speakercleaner.png', 'https://play.google.com/store/apps/details?id=com.as.speakercleaner&hl=en-IN'],
      [true, 'com.clock.sandtimer-1.png', 'https://play.google.com/store/apps/details?id=com.clock.sandtimer&hl=en-IN'],
      [true, 'com.clock.sandtimer.png', 'https://play.google.com/store/apps/details?id=com.clock.sandtimer&hl=en-IN'],
      [false, 'com.meditation.medit7-1.png', 'https://play.google.com/store/apps/details?id=com.meditation.medit8&hl=en-IN'],
      [false, 'com.meditation.medit7-2.png', 'https://play.google.com/store/apps/details?id=com.meditation.medit8&hl=en-IN'],
      // [false, 'com.walli.hd.wallpapervideo.mp3', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
      // [false, 'commeditationmedit7video.mp4', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
      [false, 'com.meditation.medit7.png', 'https://play.google.com/store/apps/details?id=com.meditation.medit8&hl=en-IN'],
      [false, 'com.music.focusflow-2.png', 'https://play.google.com/store/apps/details?id=com.music.focusflow&hl=en-IN'],
      [false, 'com.music.focusflow.png', 'https://play.google.com/store/apps/details?id=com.music.focusflow&hl=en-IN'],
      [true, 'com.walli.hd.wallpaper0.png', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
      [true, 'com.walli.hd.wallpaper1.png', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN'],
      [true, 'com.walli.hd.wallpaper2.png', 'https://play.google.com/store/apps/details?id=com.walli.hd.wallpaper&hl=en-IN']
  ];

  const handleUpload = async () => {
    try {
      const response = await axios.post(
        `http://${serverUrl}/api/v1/ads/upload-multiple-ads`,
        { adsData: adsDataList },
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      if(response.status === 200) {
        toast.success('Files uploaded successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2>Bulk Upload Images</h2>
      <button 
        onClick={handleUpload}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload All
      </button>
    </div>
  );
};

export default BulkImageUpload;
