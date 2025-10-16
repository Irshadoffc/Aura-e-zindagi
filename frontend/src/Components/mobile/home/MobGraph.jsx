import { FiEdit2, FiArrowDownRight } from "react-icons/fi";

export default function MobGraph({ tabs = [], activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 w-full max-w-full overflow-hidden">
      {/* Tabs */}
      <div className="flex gap-2 pb-3 mb-4 font-semibold overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-shrink-0 px-2 py-2 rounded-md flex flex-col items-start transition-all
              ${
                activeTab === tab.id
                  ? "bg-gray-100 border border-blue-300"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
            {/* Title + Edit */}
            <div className="flex items-center justify-between gap-1 w-full">
              <span className="underline decoration-dotted decoration-gray-400 underline-offset-4 text-xs truncate">
                {tab.title}
              </span>
              {tab.editable && (
                <FiEdit2 className="text-gray-500 flex-shrink-0 text-xs" />
              )}
            </div>

            {/* Value + Change */}
            <div className="text-[9px] sm:text-[10px] mt-1 flex items-center gap-1">
              <span>{tab.value}</span>
              {tab.change && (
                <span className="flex items-center text-gray-500 text-[9px] sm:text-[10px] font-semibold">
                  <FiArrowDownRight className="inline-block text-gray-600 ml-1 text-[9px]" />
                  {tab.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="relative h-32 sm:h-40 w-full">
        {/* Y-axis */}
        <div className="absolute left-1 top-0 bottom-[25px] flex flex-col justify-between text-gray-600 text-[8px] sm:text-[9px]">
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        {/* Graph Lines */}
        <div className="absolute left-5 right-2 top-0 bottom-8">
          <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
            {/* Solid Line */}
            <path
              d={
                activeTab === "sessions"
                  ? "M0,50 Q12,30 25,35 T50,25 T75,20 T100,30"
                  : activeTab === "sales"
                  ? "M0,45 Q12,40 25,38 T50,33 T75,35 T100,30"
                  : activeTab === "orders"
                  ? "M0,48 Q12,43 25,40 T50,38 T75,36 T100,35"
                  : "M0,50 Q12,45 25,40 T50,37 T75,39 T100,40"
              }
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            {/* Dashed Line */}
            <path
              d={
                activeTab === "sessions"
                  ? "M0,40 Q12,35 25,33 T50,28 T75,30 T100,33"
                  : activeTab === "sales"
                  ? "M0,38 Q12,36 25,35 T50,34 T75,33 T100,32"
                  : activeTab === "orders"
                  ? "M0,45 Q12,42 25,41 T50,39 T75,38 T100,37"
                  : "M0,48 Q12,44 25,42 T50,41 T75,40 T100,39"
              }
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* X-axis */}
        <div className="absolute bottom-4 left-5 right-2 flex justify-between text-[8px] sm:text-[9px] text-gray-500">
          {
            ["Aug 27", "Sep 3", "Sep 10", "Sep 17", "Sep 24"].map((date, i) => (
              <span key={i}>{date}</span>
            ))
          }
        </div>

        {/* Date Range */}
        <div className="absolute bottom-0 left-2 right-2 flex items-center justify-center text-[8px] sm:text-[10px] text-gray-600">
  <div className="flex flex-wrap items-center justify-center gap-1">
    <span className="w-[12px] h-[2px] bg-blue-400"></span>
      <span>27 Aug – 26 Sep 2025</span>
      <span className="hidden sm:inline">...</span>
      <span>27 Jul – 26 Aug 2025</span>
  </div>
</div>

      </div>
    </div>
  );
}