import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { SmartBed } from "@/models/smartBed";
import { fetchAllWards, fetchBedsByWardId } from "./api/wards_api";

export default function Patients() {
  type BedWithWardNumObject = {
    wardNum: string;
    smartbeds: SmartBed[];
  };

  const router = useRouter();
  const [allBeds, setAllBeds] = useState<BedWithWardNumObject[]>([]);

  useEffect(() => {
    fetchAllWards().then((res) => {
      const wards = res.data;
      let promises = [];
      for (var ward of wards) {
        promises.push(fetchBedsByWardId(ward._id));
      }
      let beds: BedWithWardNumObject[] = [];
      Promise.all(promises).then((res) => {
        res.forEach((w, index) => {
          const wardNum = wards[index].wardNum;
          const obj = { wardNum, smartbeds: w };
          beds.push(obj);
        });
        setAllBeds(beds);
      });
    });
  }, [allBeds.length]);

  const viewPatientVisualisation = (
    patientId: string | undefined,
    wardNum: string,
    roomNum: number,
    bedNum: number
  ) => {
    if (patientId != undefined) {
      router.push(
        `/patientVisualisation?patientId=${patientId}&wardNum=${wardNum}&roomNum=${roomNum}&bedNum=${bedNum}`
      );
    }
  };

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Typography
          textAlign="left"
          sx={{ marginBottom: "20px", flex: "1" }}
          variant="h6"
        >
          General Patients Visualisation
        </Typography>
        <Button
          variant="contained"
          sx={{ margin: "10px" }}
          href="/createPatient"
        >
          Assign New Patient
        </Button>
      </Box>
      <Grid container spacing={3}>
        {allBeds.map(({ wardNum, smartbeds }) =>
          smartbeds.map((bed) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={bed._id}>
              <Paper
                sx={{ ":hover": { cursor: "pointer" } }}
                onClick={() =>
                  viewPatientVisualisation(
                    bed.patient?._id,
                    wardNum,
                    bed.roomNum,
                    bed.bedNum
                  )
                }
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor:
                    bed.bedStatus == "occupied"
                      ? "lightgreen"
                      : bed.patient
                      ? "orange"
                      : "pink",
                }}
              >
                <p>{bed.patient ? bed.patient.name : "Vacant Bed"}</p>
                <Typography variant="h6">
                  Ward: {wardNum}, Room: {bed.roomNum}, Bed: {bed.bedNum}
                </Typography>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}
