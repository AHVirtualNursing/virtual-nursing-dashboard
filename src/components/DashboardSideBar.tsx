import { ISideBarTab } from "@/pages/dashboard";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export default function DashboardSideBar({
  drawerTabs,
  handleSideBarTabClick,
}: {
  drawerTabs: ISideBarTab[];
  handleSideBarTabClick: (key: string) => void
}) {
  const drawerWidth = 240;

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
      anchor="left"
    >
      <List>
        {drawerTabs.map((tab) => (
          <ListItem
            key={tab.text}
            disablePadding
            onClick={() => handleSideBarTabClick(tab.key)}
          >
            <ListItemButton>
              <ListItemIcon>{tab.icon}</ListItemIcon>
              <ListItemText primary={tab.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
