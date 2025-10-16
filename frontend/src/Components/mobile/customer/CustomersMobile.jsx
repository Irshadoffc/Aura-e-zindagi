"use client";
import React, { useState } from "react";
import CustomerActionsMobile from "../../mobile/customer/CustomerActionsMobile"; // ✅ Import fixed

export default function CustomersMobile() {
  const [showSortSidebar, setShowSortSidebar] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Last update");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isEditMode, setIsEditMode] = useState(false);

  const sortOptions = [
    "Last update",
    "Amount spent",
    "Total orders",
    "Last order date",
    "First order date",
    "Date added as customer",
    "Last abandoned order date",
  ];

  const customers = [
    {
      id: 1,
      customer: "Ahsan Jamil",
      location: "Lahore, Pakistan",
      ordersCount: 5,
      amountSpent: "Rs 3,500.00",
    },
    {
      id: 2,
      customer: "Saad Anjum",
      location: "Lahore, Pakistan",
      ordersCount: 3,
      amountSpent: "Rs 1,800.00",
    },
    {
      id: 3,
      customer: "Hira Ahmed",
      location: "Multan, Pakistan",
      ordersCount: 2,
      amountSpent: "Rs 2,200.00",
    },
  ];

  return (
    <>
      {/* ✅ Top Actions Component */}
      <CustomerActionsMobile />

      <div className="lg:hidden min-h-screen bg-gray-100 p-4 flex flex-col relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* User Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A8 8 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h1 className="text-lg font-semibold text-gray-800">Customers</h1>
          </div>


        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.9-5.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 018.05 8z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search customers"
            className="w-full rounded-md pl-10 pr-4 py-2 focus:outline-none placeholder-gray-600"
          />

        </div>

        {/* Customer List */}
        <div className="flex flex-col gap-3">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-lg p-3 shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-gray-700">{c.customer}</h2>
                {isEditMode && (
                  <button className="text-sm text-gray-500 italic">Edit</button>
                )}
              </div>

              <p className="text-sm text-gray-500">Location: {c.location}</p>
              <p className="text-sm text-gray-500">
                Orders: <span className="font-medium">{c.ordersCount}</span>
              </p>
              <p className="text-sm text-gray-500">
                Amount Spent:{" "}
                <span className="font-medium">{c.amountSpent}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}