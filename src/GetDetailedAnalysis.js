import { GoHomeFill } from "react-icons/go";
import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import { serverUrl } from "./const";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { RxTriangleDown } from "react-icons/rx";
import DateRangePickrr from "./DateRangePicker";
import { useNavigate } from "react-router-dom";

const GetDetailedAnalysis = memo(() => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const datePickerRef = useRef(null);
  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://${serverUrl}/api/v1/daily-analytics/get-ad-analytics?startDate=${selectedDateRange.startDate}&endDate=${selectedDateRange.endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAnalyticsData(data.data);
      } else {
        toast.error("Failed to fetch analytics data");
      }
    } catch (error) {
      toast.error("Error fetching analytics data");
    }
  }, [selectedDateRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        !event.target.closest(".rdrDateRangeWrapper")
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (ranges) => {
    const formattedDates = {
      startDate: format(ranges.startDate, "yyyy-MM-dd"),
      endDate: format(ranges.endDate, "yyyy-MM-dd"),
    };
    setSelectedDateRange(formattedDates);
  };

  const handleGetData = () => {
    fetchAnalyticsData();
  };

  const AdImage = memo(({ path }) => {
    return (
      <div className="w-10 bg-black relative">
        <div className="flex items-center justify-center group">
          <a
            href={`http://${serverUrl}/images/${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative"
          >
            <img
              src={`http://${serverUrl}/images/${path}`}
              alt="Ad"
              loading="lazy"
              className="hover:scale-150 hover:z-[999] transition-transform transform-gpu duration-300 relative"
            />
          </a>
        </div>
      </div>
    );
  });

  const filteredData = analyticsData.length
    ? analyticsData.filter((item) =>
        item.app?.app_name.toLowerCase().includes(filterValue.toLowerCase())
      )
    : [];

  return (<>
    <div className="px-4 py-4 flex items-center gap-4">
      <GoHomeFill className="text-4xl text-black hover:cursor-pointer" title="Go Home" onClick={() => navigate("/")} />
    </div>
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-36 mb-10">
        <h1 className="text-2xl font-bold text-[#252525] mb-[3%]">
          Detailed Analytics
        </h1>
      </div>
      <div className="w-full max-w-[90%] flex items-center gap-4">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter by App Name..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-64 p-2 border border-gray-300 rounded"
            />
        </div>

        <div className="mb-6 w-4/12">
          <div className="w-full flex items-center justify-center gap-4">
            <label htmlFor="dateFilter" className="w-1/3 block">
              Filter by Date:
            </label>
            <div
              className="w-11/12 py-3 flex items-center justify-center flex-wrap gap-2 bg-[#F2F2F2] rounded-none hover:cursor-pointer font-semibold relative"
              ref={datePickerRef}
            >
              <div
                className="w-full flex items-center justify-center"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <div className="flex items-center justify-center gap-4">
                  <h6>
                    {format(
                      new Date(selectedDateRange.startDate),
                      "dd MMM yyyy"
                    )}{" "}
                    -{" "}
                    {format(new Date(selectedDateRange.endDate), "dd MMM yyyy")}
                  </h6>
                  <RxTriangleDown className="text-2xl" />
                </div>
              </div>
              {isDatePickerOpen && (
                <DateRangePickrr
                onDateChange={handleDateChange}
                  selectedRange={{
                    startDate: new Date(selectedDateRange.startDate),
                    endDate: new Date(selectedDateRange.endDate),
                    key: "selection",
                  }}
                  />
                )}
            </div>
            <button
              onClick={handleGetData}
              title="Get Data"
              className="bg-blue-500 hover:bg-blue-700 text-white w-56 font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
              Get Data
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[90%]">
        {analyticsData.length ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-center">App Name</th>
                <th className="text-center">Sdk Type</th>
                <th className="text-center">Ad Preview</th>
                <th className="text-center">Ad Type</th>
                <th className="text-center">Date</th>
                <th className="text-center">Daily Impressions</th>
                <th className="text-center">Daily Clicks</th>
                <th className="text-center">CTR</th>
                <th className="text-center">Region</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                key={item.id}
                className={`w-[80%] ${
                  index % 2 === 0 ? "bg-[#E0F1FB]" : "bg-white"
                  }`}
                  >
                  <td className="text-center">{item.app?.app_name}</td>
                  <td className="text-center">{item.app?.sdk_type}</td>
                  <td className="flex items-center justify-center">
                    <AdImage path={item.ad?.ad_asset_path} />
                  </td>
                  <td className="text-center">{item.ad?.ad_type}</td>
                  <td className="text-center">{item.date}</td>
                  <td className="text-center">{item.total_impressions}</td>
                  <td className="text-center">{item.total_clicks}</td>
                  <td className="text-center">
                    {(
                      (item.total_clicks / item.total_impressions) *
                      100
                    ).toFixed(2)}
                    %
                  </td>
                  <td className="text-center">{item.region || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="w-full flex items-center justify-center p-8">
            <div className="text-xl text-gray-600 font-medium">
              No analytics data available for the selected date range
            </div>
          </div>
        )}
      </div>
    </div>
  </>
  );
});

export default GetDetailedAnalysis;
