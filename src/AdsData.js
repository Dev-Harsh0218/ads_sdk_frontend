import React, { useEffect, useState, useCallback, memo } from "react";
import { serverUrl } from "./const";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

const AdsData = memo(({ refresh }) => {
  const [adsListData, setAdsListData] = useState([]);

  /**
   * Fetches the data for all running ads from the server and updates the `adsListData` state.
   *
   * This function is memoized using `useCallback` to avoid unnecessary re-fetching of data.
   */
  const fetchAdsData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://${serverUrl}/api/v1/run-ads/get-all-running-ads`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAdsListData(data.data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  }, []);

  /**
   * Fetches the data for all running ads from the server and updates the `adsListData` state whenever the `refresh` prop or `fetchAdsData` function changes.
   */
  useEffect(() => {
    fetchAdsData();
  }, [refresh, fetchAdsData]);

  /**
   * Deletes a running ad from the server.
   *
   * @param{string} running_ad_id - The ID of the running ad to be deleted. inside the body of the request
   * @returns {Promise<void>} - A Promise that resolves when the ad is successfully deleted, or rejects with an error.
   */
  const handleDelete = useCallback(async (running_ad_id) => {
    try {
      const response = await fetch(
        `http://${serverUrl}/api/v1/run-ads/delete-running-ad`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: running_ad_id }),
        }
      );
      const data = await response.json();
      if (data.message === "Ad deactivated successfully") {
        toast.success("Ad Deactivated successfully");
        fetchAdsData();
      } else {
        console.error("Error deleting ad item:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [fetchAdsData]);

  const trimExtension = useCallback((str) => {
    const lastDotIndex = str.lastIndexOf(".");
    return lastDotIndex === -1 ? str : str.slice(0, lastDotIndex);
  }, []);

  const AdImage = memo(({ path }) => (
    <div className="w-10 bg-black">
      <div className="flex items-center justify-center hover:scale-150 transition-transform transform-gpu duration-300">
        <a href={`http://${serverUrl}/images/${path}`} target="_blank" rel="noopener noreferrer">
          <img src={`http://${serverUrl}/images/${path}`} alt="Ad" loading="lazy" />
        </a>
      </div>
    </div>
  ));

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-[#252525] mb-[3%]">Ads Sdk data</h1>
      <div className="w-full max-w-[90%]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center">Apk Unique Key</th>
              <th className="text-left">redirection_link</th>
              <th className="text-left">Ads Image</th>
              <th className="text-center">preview</th>
              <th className="text-center">Total Impressions</th>
              <th className="text-center">Total Clicks</th>
            </tr>
          </thead>
          <tbody>
            {adsListData.map((dataItem,index) => (
              <tr
                key={index}
                className={`w-[80%] ${
                  index % 2 === 0 ? "bg-[#E0F1FB]" : "bg-white"
                }`}>
                <td className="text-center">
                  {dataItem.Registered_apk_key.app_name}
                </td>
                <td className="text-left">{dataItem.Ad.app_link}</td>
                <td className="text-left">
                  {trimExtension(dataItem.Ad.ad_asset_path)}
                </td>
                <td className="flex items-center justify-center">
                  <AdImage path={dataItem.Ad.ad_asset_path} />
                </td>
                <td className="text-center">{dataItem.impression_count}</td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-4">
                    <h2 className="text-center">{dataItem.click_count}</h2>
                    <MdDelete
                      onClick={() => handleDelete(dataItem.id)}
                      className="text-blue-500 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AdsData;
