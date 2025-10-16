import React from "react";
import MobCards from "./MobCards";
import CalendarPickerMob from "./CalendarPickerMob";
import ResponsiveChannelDropdown from "./ResponsiveChannelDropdown";
import MobGraph from "./MobGraph";

const HomeMobile = () => {
  const [activeTab, setActiveTab] = React.useState("sessions");

  const tabs = [
    { id: "sales", title: "Total sales", value: "Rs 0", editable: false },
    { id: "orders", title: "Orders", value: "0", editable: false },
  ];

  return (
    <div></div>
  );
};

export default HomeMobile;