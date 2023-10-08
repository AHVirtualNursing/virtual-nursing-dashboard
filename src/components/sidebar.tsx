import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import BedIcon from "@mui/icons-material/Bed";
import { SvgIconProps } from "@material-ui/core";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Link from "next/link";
import LockReset from "@mui/icons-material/LockReset";

export default function Sidebar() {
  return (
    <div className="left-0 flex flex-col h-[calc(100vh-114px)] pt-9 shadow-lg gap-4 w-64">
      <SidebarTab name={"Patients"} icon={<GroupIcon />} dest={"dashboard"} />
      <SidebarTab name={"Wards"} icon={<BedIcon />} dest={"wards"} />
      <SidebarTab
        name={"Alerts"}
        icon={<NotificationsActiveIcon />}
        dest={"alerts"}
      />
      <SidebarTab
        name={"Configs"}
        icon={<SettingsSuggestIcon />}
        dest={"configs"}
      />
      <SidebarTab name={"Change Password"} icon={<LockReset />} dest={""} />
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
      <div className="flex group gap-3 hover:bg-slate-200 cursor-pointer p-4 rounded-md">
        {icon}
        <span className="text-md text-left max-sm:hidden">{name}</span>
      </div>
    </Link>
  );
};
