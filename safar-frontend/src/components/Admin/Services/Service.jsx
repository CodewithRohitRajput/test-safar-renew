"use client";
import AdminTopbar from "@/components/AdminTopbar";
import IconeTabPanel from "@/components/Dynamic/CustomTabPanel/IconeTabPanel";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import SportsHandballIcon from "@mui/icons-material/SportsHandball"; 
import Vehicle from "./Vehicle";

const Service = () => {
    const tabs = [
  { icon: <LocalTaxiIcon sx={{ color: "black" }} />, label: "Vehicles" },
  { icon: <LocalHotelIcon sx={{ color: "black" }} />, label: "Hotels" },
  { icon: <SportsHandballIcon sx={{ color: "black" }} />, label: "Activity" },
];

const tabContents = [
  <div><Vehicle/></div>,
  <div>Hotel Content Here</div>,
  <div>Activity Content Here</div>,
];
  return (
    <>
      <div className=" flex h-screen w-full  bg-white ">
        <div className="ml-0 w-full animate-fadeIn rounded-2xl bg-white p-16 sm:ml-60 ">
          <AdminTopbar topbar_title={"Service"} />
          <IconeTabPanel tabs={tabs} tabContents={tabContents} />
        </div>
      </div>
    </>
  );
};

export default Service;
