import React from 'react';
import DeskGraph from './DeskGraph';
import Cards from './Cards';
import HomeMobile from '../../mobile/home/HomeMobile';

const DeskHomePage = () => {
  const tabs = [
    { id: "sales", title: "Total sales", value: "Rs 0 ", editable: false },
    { id: "orders", title: "Orders", value: "0 ", editable: false },
  ];

  const [activeTab, setActiveTab] = React.useState("sessions");

  return (
    <>
      <HomeMobile />
      <div className="flex flex-col min-h-screen bg-gray-200 pt-4">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-32 space-y-4">
          
          {/* Row 2 */}
          <DeskGraph tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

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
