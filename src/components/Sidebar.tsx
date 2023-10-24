import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import BedIcon from "@mui/icons-material/Bed";
import { SvgIconProps } from "@material-ui/core";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="left-0 flex flex-col h-[calc(100vh-110px)] sticky top-1 p-3 gap-4 bg-blue-900">
      <SidebarTab
        name={"Patients"}
        icon={<GroupIcon style={{ color: "white" }} />}
        dest={"dashboard"}
      />
      <SidebarTab
        name={"Wards"}
        icon={<BedIcon style={{ color: "white" }} />}
        dest={"wards"}
      />
      <SidebarTab
        name={"Alerts"}
        icon={<NotificationsActiveIcon style={{ color: "white" }} />}
        dest={"alerts"}
      />
      <SidebarTab
        name={"Configs"}
        icon={<SettingsSuggestIcon style={{ color: "white" }} />}
        dest={"configs"}
      />
    </div>
  );
}

type SidebarTabProps = {
  name: string;
  icon: SvgIconProps;
  dest: string;
};

const SidebarTab = ({ name, icon, dest }: SidebarTabProps) => {
  return (
    <Link href={dest} className="no-underline text-black">
      <div className="flex group gap-3 hover:bg-slate-500 cursor-pointer p-4 rounded-md">
        {icon}
        {/* <span className="text-md text-left max-sm:hidden">{name}</span> */}
      </div>
    </Link>
  );
};
