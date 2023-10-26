import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
} from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function OverviewSelection() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar className="flex justify-end">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: 500,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 500,
            boxSizing: "border-box",
            position: "absolute",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <div className="flex items-center">
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
          <p>Graphs</p>
        </div>
        <Divider />
        <List>
          <p>Graph 1</p>
        </List>
        <Divider />
        <List>
          <p>Graph 2</p>
        </List>
        <Divider />
      </Drawer>
    </div>
  );
}

export default OverviewSelection;
