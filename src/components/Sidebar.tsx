import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import BedIcon from "@mui/icons-material/Bed";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { SvgIconProps } from "@material-ui/core";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Link from "next/link";
import { ChatBox } from "./ChatBox";

export default function Sidebar() {
  return (
    <div className="left-0 flex flex-col h-screen fixed p-3 gap-4 w-14 bg-blue-900">
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
        name={"Reports"}
        icon={<AssignmentIndIcon style={{ color: "white" }} />}
        dest={"reports"}
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
      <ChatBox />
    </div>
  );
}

type SidebarTabProps = {
  name: string;
  icon: JSX.Element;
  dest: string;
};

const SidebarTab = ({ icon, dest }: SidebarTabProps) => {
  return (
    <Link href={dest} className="no-underline text-black">
      <div className="flex group gap-3 hover:bg-blue-400 cursor-pointer p-4 rounded-md">
        {icon}
      </div>
    </Link>
  );
};
