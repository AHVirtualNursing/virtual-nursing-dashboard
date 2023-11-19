import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import router from "next/router";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { SmartBed } from "@/types/smartbed";
import { Patient } from "@/types/patient";
import { fetchAllWards, fetchBedsByWardId } from "./api/wards_api";
import {
  createNewPatient,
  fetchAllPatients,
  fetchPatientByPatientNRIC,
} from "./api/patients_api";
import { updateSmartbedByBedId } from "./api/smartbed_api";

export default function CreatePatient() {
  type BedWithWardNumObject = {
    wardNum: string;
    smartbeds: SmartBed[];
  };

  const [bedAssigned, setAssignedBed] = React.useState("");

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showNricErrorMessage, setShowNricErrorMessage] = useState(false);
  const [showNameErrorMessage, setShowNameErrorMessage] = useState(false);
  const [showBedErrorMessage, setShowBedErrorMessage] = useState(false);
  const [showConditionErrorMessage, setShowConditionErrorMessage] =
    useState(false);

  const [allPatientsData, setAllPatientsData] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatientNRIC, setNewPatientNRIC] = useState("");
  const [patientName, setPatientName] = useState("");
  const filter = createFilterOptions<string>();

  const [vacantBeds, setVacantBeds] = useState<BedWithWardNumObject[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  //search all existing discharged patients in the database
  useEffect(() => {
    fetchAllPatients().then((res) => {
      const allPatients = res;
      let patientList: Patient[] = [];
      patientList = allPatients.filter(
        (patient: Patient) => patient.isDischarged
      );
      setAllPatientsData(patientList);
    });
  }, [allPatientsData.length]);

  // fetch all beds and store vacant beds for selection
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
          const vacantBeds = w.filter(
            (bed: { bedStatus: string; patient: Patient }) =>
              bed.bedStatus === "vacant" &&
              (bed.patient === undefined || bed.patient === null)
          );
          const obj = { wardNum, smartbeds: vacantBeds };
          beds.push(obj);
        });
        setVacantBeds(beds);
      });
    });
  }, [vacantBeds.length]);

  const handleChange = (event: SelectChangeEvent) => {
    setAssignedBed(event.target.value);
    setShowBedErrorMessage(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const patientName = data.get("patientName") as string;
    const condition = data.get("condition") as string;
    const patientNric = data.get("patientNric") as string;
    const nricRegex = /^[STGFstgf]\d{7}[A-Za-z]$/;

    let hasErrors = false;

    if (!patientName) {
      setShowNameErrorMessage(true);
      hasErrors = true;
    } else {
      setShowNameErrorMessage(false);
    }
    if (!patientNric || !nricRegex.test(patientNric)) {
      setShowNricErrorMessage(true);
      hasErrors = true;
    } else {
      setShowNricErrorMessage(false);
    }
    if (bedAssigned == "") {
      setShowBedErrorMessage(true);
      hasErrors = true;
    } else {
      setShowBedErrorMessage(false);
    }
    if (!condition) {
      setShowConditionErrorMessage(true);
      hasErrors = true;
    } else {
      setShowConditionErrorMessage(false);
    }

    if (hasErrors) {
      return;
    }
    const res = await createNewPatient(
      patientName,
      patientNric,
      condition,
      bedAssigned
    );
    console.log(res?.status);
    if (res?.status === 200) {
      setOpenSnackbar(true);
      setShowSuccessMessage(true);
      setShowNricErrorMessage(false);
      setShowNameErrorMessage(false);
      setShowBedErrorMessage(false);
      setShowConditionErrorMessage(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  };

  const handleCloseSnackbar = (_?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleExistingPatientSelection = (
    event: SyntheticEvent<Element, Event>,
    selectedPatientNRIC: string | null
  ) => {
    if (selectedPatientNRIC?.startsWith("Create")) {
      setNewPatientNRIC(selectedPatientNRIC.split(" ")[5]);
      setPatientName("");
    } else if (selectedPatientNRIC) {
      fetchPatientByPatientNRIC(selectedPatientNRIC).then((res) => {
        const selectedPatient = res;
        setSelectedPatient(selectedPatient);
        setPatientName(selectedPatient ? selectedPatient.name : "");
      });
    } else {
      setSelectedPatient(null);
      setPatientName("");
    }
  };

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Update the customName state with the user's input
    setPatientName(event.target.value);
  };

  return (
    <div className="flex flex-col p-8 gap-6 w-full shadow-lg bg-slate-100">
      <h4 style={{ textAlign: "left" }}>Virtual Nurse Dashboard</h4>
      <div className="bg-white rounded-2xl h-400 p-4 flex shadow-lg">
        <div className="flex flex-col w-full p-4 gap-y-3">
          <h3 className="text-left">Create New Patient/Assign To Bed</h3>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Autocomplete
              options={allPatientsData.map((patient) => patient.nric)}
              value={selectedPatient ? selectedPatient.nric : newPatientNRIC}
              freeSolo
              id="patientNric"
              // onInputChange={handleInputNRICChange}
              onChange={handleExistingPatientSelection}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== "") {
                  filtered.push(
                    `Create New Patient with NRIC ${params.inputValue}`
                  );
                  params.inputValue = "";
                } else {
                  params.inputValue = "";
                }

                return filtered;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  fullWidth
                  label="Search Existing Patients by NRIC or Input New Patient NRIC"
                  name="patientNric"
                  sx={{ paddingBottom: "10px" }}
                  error={showNricErrorMessage}
                  helperText={
                    showNricErrorMessage ? (
                      <Typography variant="caption" color="error">
                        *Please ensure that NRIC is filled in and is of the
                        right format.
                      </Typography>
                    ) : null
                  }
                  autoFocus
                />
              )}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="patientName"
              label="Name of Patient"
              name="patientName"
              value={patientName}
              onChange={handleNameChange}
              sx={{ paddingBottom: "10px" }}
              error={showNameErrorMessage}
              helperText={
                showNameErrorMessage ? (
                  <Typography variant="caption" color="error">
                    *Please ensure that the Name of the patient is filled in.
                  </Typography>
                ) : null
              }
            ></TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="condition"
              label="Patient Condition"
              name="condition"
              sx={{ paddingBottom: "10px" }}
              error={showConditionErrorMessage}
              helperText={
                showConditionErrorMessage ? (
                  <Typography variant="caption" color="error">
                    *Please ensure that the Condition of the patient is filled
                    in.
                  </Typography>
                ) : null
              }
            ></TextField>
            <FormControl fullWidth error={showBedErrorMessage}>
              <InputLabel sx={{ textAlign: "left" }} id="wardRoomBedLabel">
                Selected Bed
              </InputLabel>
              <Select
                fullWidth
                required
                value={bedAssigned}
                onChange={handleChange}
                error={showBedErrorMessage}
              >
                {vacantBeds.every(
                  (bedData) => bedData.smartbeds.length === 0
                ) ? (
                  <MenuItem key="no-beds" disabled>
                    No available/vacant beds
                  </MenuItem>
                ) : (
                  vacantBeds.map(({ wardNum, smartbeds }) =>
                    smartbeds.length === 0
                      ? null
                      : smartbeds.map((bed) => (
                          <MenuItem key={bed._id} value={bed._id}>
                            Ward: {wardNum}, Room: {bed.roomNum}, Bed:{" "}
                            {bed.bedNum}
                          </MenuItem>
                        ))
                  )
                )}
              </Select>
              {showBedErrorMessage && (
                <FormHelperText sx={{ textAlign: "left", color: "red" }}>
                  *Please ensure that a bed is selected.
                </FormHelperText>
              )}
            </FormControl>
            <div style={{ width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
              >
                Assign Patient
              </Button>
            </div>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                New Patient registered successfully.
              </Alert>
            </Snackbar>
          </Box>
        </div>
      </div>
    </div>
  );
}
