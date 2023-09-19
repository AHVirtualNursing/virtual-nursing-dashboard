import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper, Button } from "@mui/material";
import { Ward } from "@/models/ward";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { fetchAllWards } from "./api/wards_api";

export default function Wards() {
  const router = useRouter();

  const [wardsList, setWardsList] = useState<Ward[]>([]);

  useEffect(() => {
    fetchAllWards().then((res) => setWardsList(res.data));
  }, [wardsList.length]);

  const viewWardVisualisation = (wardId: string, wardNum: string) => {
    router.push({
      pathname: "/wardVisualisation",
      query: { wardId: wardId, wardNum: wardNum },
    });
  };

  const handleLogoutButton = () => {
    signOut();
  };

  return (
    <div>
      <Typography textAlign="left" sx={{ marginBottom: "20px" }} variant="h6">
        Wards Page
      </Typography>
      <Grid container spacing={3}>
        {wardsList.map((ward) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ward._id}>
            <Paper
              sx={{ ":hover": { cursor: "pointer" } }}
              onClick={() => viewWardVisualisation(ward._id, ward.num)}
              elevation={3}
              style={{
                padding: "16px",
              }}
            >
              <Typography variant="h6">
                Ward: {ward.num}, Bed Count : {ward.smartBeds?.length}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
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
