import React from "react";
import DeskHomePage from "../desktop/home/DeskHomePage";
import HomeMobile from "../mobile/home/HomeMobile";

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <DeskHomePage /> : <HomeMobile />;
}
