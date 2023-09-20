import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import { signOut } from "next-auth/react";
import { useState } from "react";

export interface ISideBarTab {
  text: string;
  key: string;
  icon: JSX.Element;
}

export default function DashboardSideBar({
  handleSideBarTabClick,
}: {
  handleSideBarTabClick: (key: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("patients");

  const drawerWidth = 240;
  const patientsTab: ISideBarTab = {
    text: "General Patients Visualisation",
    key: "patients",
    icon: <ApartmentIcon />,
  };

  const wardsTab: ISideBarTab = {
    text: "Wards",
    key: "wards",
    icon: <BedIcon />,
  };

  const alertsTab: ISideBarTab = {
    text: "Alerts",
    key: "alerts",
    icon: <NotificationsIcon />,
  };

  const changePasswordTab: ISideBarTab = {
    text: "Change Password",
    key: "changePassword",
    icon: <LockResetIcon />,
  };

  const drawerTabs: ISideBarTab[] = [
    patientsTab,
    wardsTab,
    alertsTab,
    changePasswordTab,
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "80px",
        },
      }}
      variant="permanent"
      anchor="left">
      <List>
        {drawerTabs.map((tab) => (
          <ListItem
            key={tab.text}
            disablePadding
            onClick={() => {
              handleSideBarTabClick(tab.key);
              setActiveTab(tab.key);
            }}
          >
            <ListItemButton
              sx={{ backgroundColor: activeTab === tab.key ? "lightblue" : "" }}
            >
              <ListItemIcon>{tab.icon}</ListItemIcon>
              <ListItemText primary={tab.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding onClick={() => signOut()}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Log Out"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
