import React, { useState, useEffect } from 'react';
import DeskGraph from './DeskGraph';
import Cards from './Cards';
import HomeMobile from '../../mobile/home/HomeMobile';
import api from '../../../api/Axios';

const DeskHomePage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth, selectedYear]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/dashboard/analytics?month=${selectedMonth + 1}&year=${selectedYear}`);
      console.log('Analytics Response:', response.data);
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const monthlyTotals = analyticsData && analyticsData.daily_sales && analyticsData.daily_sales.length > 0 ? {
    revenue: analyticsData.daily_sales.reduce((sum, day) => sum + parseFloat(day.revenue || 0), 0),
    orders: analyticsData.daily_sales.reduce((sum, day) => sum + parseInt(day.orders || 0), 0)
  } : analyticsData && analyticsData.overview ? {
    revenue: analyticsData.overview.total_revenue || 0,
    orders: analyticsData.overview.total_orders || 0
  } : { revenue: 0, orders: 0 };

  console.log('Monthly Totals:', monthlyTotals, 'Analytics Data:', analyticsData);

  const tabs = [
    { 
      id: "sales", 
      title: "Total sales", 
      value: monthlyTotals.revenue > 0 ? `Rs ${(monthlyTotals.revenue * 280).toFixed(0)} ` : "Rs 0 ", 
      editable: false 
    },
    { 
      id: "orders", 
      title: "Orders", 
      value: monthlyTotals.orders > 0 ? `${monthlyTotals.orders} ` : "0 ", 
      editable: false 
    },
  ];

  return (
    <>
      <HomeMobile />
      <div className="flex flex-col min-h-screen bg-gray-200 pt-4">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-32 space-y-4">
          
          {/* Row 2 */}
          <DeskGraph 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            analyticsData={analyticsData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          {/* Row 3 */}
          <Cards />

          {/* Row 4 */}
          <div className="flex items-center my-6 w-full">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="flex items-center mx-3 text-gray-700 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"></div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Row 5 */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-base font-bold mb-2">Drive traffic</h3>
                  <p className="text-gray-800 text-sm">
                    Use marketing tools to attract more potential customers.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-base font-bold mb-2">Improve conversion</h3>
                  <p className="text-gray-700 text-sm">
                    Convert more customers faster with built-in tools.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-base font-bold mb-2">Increase order value</h3>
                  <p className="text-gray-700 text-sm">
                    Boost sales by expanding to new channels, offering bundles, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default DeskHomePage;