// src/AddAdsHandleData.js
import React, { useEffect, useRef, useState } from "react";
import {toast} from "react-hot-toast";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import { serverUrl } from "./const";
import AdsData from "./AdsData";

const AddAdsHandleData = ({hardRefresh}) => {
  const [refreshAdsImages, setRefreshAdsImages] = useState(0);
  const [refreshRunningAdsComponent, setRefreshRunningAdsComponent] = useState(0);
  const [showRegisterApps, setShowRegisterApps] = useState([]);
  const [showRegisterAppsToggle, setShowRegisterAppsToggle] = useState(false);
  const [apkUniqueKey, setApkUniqueKey] = useState('');
  const [adsListData, setAdsListData] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const appsWrapperRef = useRef(null);

  const refreshAdsData = () => {
    setRefreshAdsImages((prev) => prev + 1);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appsWrapperRef.current &&
        !appsWrapperRef.current.contains(event.target)
      ) {
        setShowRegisterAppsToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://${serverUrl}/api/v1/ads/get-all-ads`
        );
        setSuggestions(response.data.ads);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [refreshAdsImages]);
  
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get(
          `http://${serverUrl}/api/v1/apps/getAllApps`
        );
        setShowRegisterApps(response.data.data);
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    };
    fetchApps();
  }, [hardRefresh]);
  
  useEffect(() => {
    setRefreshAdsImages(prev=>prev+1);
    setRefreshRunningAdsComponent(prev=>prev+1);
  }, [hardRefresh]);
  
  const handleSuggestionClick = (imageName) => {
    if (adsListData) {
      setAdsListData([...adsListData, imageName]);
    } else {
      setAdsListData([imageName]);
    }
    setShowSuggestions(false);
  };
  
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const entries = inputValue.split(",").filter((entry) => entry.trim());
    //convert entries back to array of ad objects
    const updatedEntries = entries
      .map((entry) => {
        const matchingAd = suggestions.find(
          (ad) => ad.ad_asset_path === entry.trim()
        );
        return matchingAd;
      })
      .filter(Boolean); //Remove any undefined entries
    setAdsListData(updatedEntries);
  };

  const handleAppSelection = (item) => {
    setApkUniqueKey(item);
    setShowRegisterAppsToggle(false);
  };

  const resetData = () => {
    setAdsListData("");
    setApkUniqueKey(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://${serverUrl}/api/v1/run-ads/create-running-multiple-ads`,
        {
          app_id: apkUniqueKey.app_id,
          adslistData: adsListData,
        }
      );
      if (response.status === 201) {
        console.log(response.data);
        // console.log("Data inserted successfully");
        toast.success("Created running ads successfully")
      }
      resetData();
      setRefreshRunningAdsComponent(prev => (prev > 10)?0:prev+1);
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold">Add Ads Handle Data</h2>
      <div className=" grid grid-cols-3 mt-20 ">
        <div className="flex flex-col col-span-1 items-center">
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4 relative" ref={appsWrapperRef}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Apk Unique Key:
              </label>
              <input
                type="text"
                value={apkUniqueKey ? apkUniqueKey.app_name : ''}
                onFocus={() => {setShowRegisterAppsToggle(true)}}
                onChange={(e) => setApkUniqueKey(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {showRegisterAppsToggle && showRegisterApps && (
                <div className="absolute h-72 overflow-scroll bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-10">
                  {showRegisterApps.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200 border-b border-[#CFE1EE] border-1 flex items-center justify-between"
                      onClick={() => handleAppSelection(item)}
                    >
                      {item.app_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-6 relative" ref={wrapperRef}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ads List Data (comma-separated):
              </label>
              <input
                type="text"
                value={
                  Array.isArray(adsListData)
                    ? adsListData.map((ad) => ad.ad_asset_path).join(",")
                    : ""
                }
                onChange={(e) => handleInputChange(e)}
                onFocus={() => setShowSuggestions(true)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute h-72 overflow-scroll bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 min-h-28 cursor-pointer ${index % 2 === 0 ? "bg-[#E0F1FB]" : "bg-white"} hover:bg-gray-200 border-b border-[#CFE1EE] border-1 flex items-center justify-between`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="">{suggestion.ad_asset_path}</div>
                      <div className="image-preview w-10">
                        <img
                          src={`http://${serverUrl}/images/${suggestion.ad_asset_path}`}
                          alt=""
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className=" col-span-1"></div>
        <div className="flex flex-col col-span-1 items-center">
          <ImageUpload onUploadSuccess={refreshAdsData} />
        </div>
      </div>
      <div className=" w-screen flex items-center justify-center">
        <AdsData refresh={refreshRunningAdsComponent} />
      </div>
    </div>
  );
};

export default AddAdsHandleData;