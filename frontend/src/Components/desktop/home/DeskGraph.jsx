import { FiEdit2, FiArrowDownRight } from "react-icons/fi";
import { useState } from "react";

export default function DeskGraph({ tabs = [], activeTab, setActiveTab, analyticsData, selectedMonth, selectedYear, onMonthChange, onYearChange }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = Math.max(0, Math.min(1, (x - 32) / (rect.width - 64)));
    
    if (analyticsData && analyticsData.daily_sales && analyticsData.daily_sales.length > 0) {
      const dataIndex = Math.floor(relativeX * analyticsData.daily_sales.length);
      if (dataIndex >= 0 && dataIndex < analyticsData.daily_sales.length) {
        const data = analyticsData.daily_sales[dataIndex];
        setTooltip({
          show: true,
          x: e.clientX,
          y: e.clientY - 60,
          data: {
            date: new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            orders: data.orders || 0,
            revenue: ((parseFloat(data.revenue || 0)) * 280).toFixed(0)
          }
        });
      }
    }
  };
  
  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, data: null });
  };
  
  const generatePath = (type) => {
    if (!analyticsData || !analyticsData.daily_sales || analyticsData.daily_sales.length === 0) {
      return "M0,250 L800,250"; // Flat line at bottom when no data
    }
    
    const sales = analyticsData.daily_sales;
    const values = sales.map(s => type === 'revenue' ? parseFloat(s.revenue) : parseInt(s.orders));
    const max = Math.max(...values) || 1;
    const min = Math.min(...values) || 0;
    
    const points = values.map((val, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 800;
      const y = 250 - ((val - min) / Math.max(max - min, 1)) * 150;
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  };
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full">
      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3 mb-6 font-semibold">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer px-3 py-2 rounded-md flex flex-col
              ${activeTab === tab.id ? "bg-gray-100 border border-blue-300" : "text-gray-700"}
            `}
          >
            {/* Title + Edit */}
            <div
              className={`flex items-center justify-between gap-2`}
            >
              <span className="underline decoration-dotted decoration-gray-400 underline-offset-4 truncate">
                {tab.title}
              </span>
              {tab.editable && <FiEdit2 className="text-gray-500 flex-shrink-0" />}
            </div>

            {/* Value + Change */}
            <div className="text-xs md:text-sm mt-2 flex items-center gap-1">
              <span>{tab.value}</span>
              {String(tab.value).includes("0") && (
                <span className="w-4 h-[2px] bg-gray-500 inline-block rounded ml-1"></span>
              )}
              {tab.change && (
                <span className="flex items-center text-gray-500 text-xs font-bold">
                  <FiArrowDownRight className="inline-block text-gray-600 ml-1" />
                  {tab.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
        {/* Y-axis */}
        <div className="absolute left-[6px] md:left-[10px] top-0 bottom-[40px] flex flex-col justify-between text-gray-600 text-[10px] sm:text-xs">
          <span>{analyticsData && analyticsData.daily_sales && analyticsData.daily_sales.length > 0 ? Math.max(...analyticsData.daily_sales.map(s => activeTab === 'sales' ? Math.round(parseFloat(s.revenue)) : parseInt(s.orders))) : 40}</span>
          <span>{analyticsData && analyticsData.daily_sales && analyticsData.daily_sales.length > 0 ? Math.round(Math.max(...analyticsData.daily_sales.map(s => activeTab === 'sales' ? Math.round(parseFloat(s.revenue)) : parseInt(s.orders))) / 2) : 20}</span>
          <span>0</span>
        </div>

        {/* Graph Lines */}
        <div 
          className="absolute left-8 md:left-10 right-0 top-0 bottom-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 800 250"
            preserveAspectRatio="none"
          >
            {/* Solid Line */}
            <path
              d={
                activeTab === "sessions"
                  ? "M0,250 Q50,120 100,140 T200,100 T300,110 T400,80 T500,120 T600,90 T700,90 T800,110"
                  : activeTab === "sales"
                  ? "M0,200 Q50,180 100,160 T200,140 T300,150 T400,130 T500,150 T600,120 T700,140 T800,130"
                  : activeTab === "orders"
                  ? "M0,220 Q50,200 100,180 T200,160 T300,170 T400,150 T500,170 T600,140 T700,160 T800,150"
                  : "M0,240 Q50,220 100,200 T200,180 T300,190 T400,170 T500,180 T600,160 T700,170 T800,160"
              }
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            {/* Dashed Line */}
            <path
              d={
                activeTab === "sessions"
                  ? "M0,160 Q50,120 100,150 T200,110 T300,130 T400,100 T500,100 T600,120 T700,110 T800,130"
                  : activeTab === "sales"
                  ? "M0,140 Q50,150 100,170 T200,150 T300,170 T400,160 T500,180 T600,150 T700,170 T800,160"
                  : activeTab === "orders"
                  ? "M0,180 Q50,190 100,200 T200,180 T300,200 T400,190 T500,200 T600,170 T700,190 T800,180"
                  : "M0,200 Q50,210 100,220 T200,200 T300,210 T400,200 T500,210 T600,190 T700,200 T800,190"
              }
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            
            {/* Hover Dots */}
            {tooltip.show && (
              <>
                <circle
                  cx={tooltip.x}
                  cy={activeTab === "sessions" ? 120 + Math.sin(tooltip.x / 100) * 30 :
                      activeTab === "sales" ? 140 + Math.sin(tooltip.x / 80) * 20 :
                      160 + Math.sin(tooltip.x / 90) * 25}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx={tooltip.x}
                  cy={activeTab === "sessions" ? 130 + Math.sin(tooltip.x / 120) * 25 :
                      activeTab === "sales" ? 160 + Math.sin(tooltip.x / 70) * 15 :
                      190 + Math.sin(tooltip.x / 85) * 20}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        </div>

        {/* X-axis */}
        <div className="absolute bottom-6 left-8 md:left-10 right-0 flex justify-between text-[10px] sm:text-xs text-gray-500">
          {analyticsData && analyticsData.daily_sales && analyticsData.daily_sales.length > 0 ? 
            analyticsData.daily_sales.filter((_, i) => i % Math.ceil(analyticsData.daily_sales.length / 10) === 0).slice(0, 10).map((sale, i) => (
              <span key={i}>
                {new Date(sale.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            )) :
            Array.from({ length: 10 }, (_, i) => {
              const baseDate = new Date(selectedYear, selectedMonth, 1 + i * 3);
              return (
                <span key={i}>
                  {baseDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              );
            })
          }
        </div>

        {/* Month/Year Selector */}
        <div className="absolute bottom-0 text-gray-500 left-8 md:left-10 right-0 flex items-center justify-center text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => onMonthChange(parseInt(e.target.value))}
              className="text-xs border rounded px-1"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="text-xs border rounded px-1"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltip.show && tooltip.data && (
        <div 
          className="absolute bg-black text-white p-2 rounded text-xs z-50 pointer-events-none"
          style={{ 
            left: tooltip.x + 10, 
            top: tooltip.y - 10
          }}
        >
          <div>{tooltip.data.date}</div>
          <div>Orders: {tooltip.data.orders}</div>
          <div>Sales: Rs {tooltip.data.revenue}</div>
        </div>
      )}
    </div>
  );
}