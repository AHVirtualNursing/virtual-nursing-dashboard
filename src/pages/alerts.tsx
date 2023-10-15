import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { signOut } from "next-auth/react";
import { rows, columns } from "../mockData";

export default function Alerts() {
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .alert-OPEN": {
      backgroundColor: "#FF5151",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#FF5151",
      },
    },
    "& .alert-HANDLING": {
      backgroundColor: "#FFA829",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#FFA829",
      },
    },
    "& .alert-COMPLETED": {
      backgroundColor: "lightgreen",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "lightgreen",
      },
    },
  }));

  const handleLogoutButton = () => {
    signOut();
  };
  return (
    <div className="flex flex-col p-8 gap-8 bg-blue-100 w-full shadow-lg">
      <Typography textAlign="left" sx={{ marginBottom: "20px" }} variant="h6">
        View List of Alerts
      </Typography>
      <Box
        sx={{
          height: "70%",
          width: "100%",
        }}
      >
        <StyledDataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          onRowDoubleClick={() => alert("You clicked me")}
          getRowClassName={(params) => `alert-${params.row.Status}`}
        />
      </Box>
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={handleLogoutButton}
      >
        Temporary Logout
      </Button>
    </div>
  );
}
