import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ModalBoxStyle } from "@/styles/StyleTemplates";

function TileCustomisationModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    console.log("submit and redirect");
  };

  interface Vital {
    allVitals: boolean;
    hr: boolean;
    rr: boolean;
    spo2: boolean;
    bp: boolean;
    temp: boolean;
    news2: boolean;
  }

  interface Bed {
    allBedStatuses: boolean;
    rail: boolean;
    exit: boolean;
    lowestPosition: boolean;
    brake: boolean;
    weight: boolean;
    fallRisk: boolean;
  }

  const [vitals, setVitalsState] = useState<Vital>({
    allVitals: true,
    hr: true,
    rr: true,
    spo2: true,
    bp: true,
    temp: true,
    news2: true,
  });

  const [bed, setBedState] = useState<Bed>({
    allBedStatuses: true,
    rail: true,
    exit: true,
    lowestPosition: true,
    brake: true,
    weight: true,
    fallRisk: true,
  });

  const vitalCheckboxes: { name: keyof Vital; label: string }[] = [
    { name: "allVitals", label: "All Vitals" },
    { name: "hr", label: "Heart Rate" },
    { name: "rr", label: "Respiratory Rate" },
    { name: "spo2", label: "SPO2" },
    { name: "bp", label: "Blood Pressure" },
    { name: "temp", label: "Temperature" },
    { name: "news2", label: "NEWS2" },
  ];

  const bedCheckboxes: { name: keyof Bed; label: string }[] = [
    { name: "allBedStatuses", label: "All Bed Statuses" },
    { name: "rail", label: "Patient & Rail Visuals" },
    { name: "exit", label: "Bed Exit Status" },
    { name: "lowestPosition", label: "Bed Lowest Position Status" },
    { name: "brake", label: "Bed Brake On Status" },
    { name: "weight", label: "Weight of Patient" },
    { name: "fallRisk", label: "Fall Risk of Patient" },
  ];

  const handleVitalsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === "allVitals") {
      setVitalsState((prevVitals) => {
        const updatedVitals = { ...prevVitals };
        for (const key in updatedVitals) {
          const vitalKey = key as keyof Vital;
          updatedVitals[vitalKey] = checked;
        }
        return updatedVitals;
      });
    } else {
      setVitalsState({
        ...vitals,
        [name]: checked,
      });
    }
  };

  const handleBedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === "allBedStatuses") {
      setBedState((prevBed) => {
        const updatedBed = { ...prevBed };
        for (const key in updatedBed) {
          const bedKey = key as keyof Bed;
          updatedBed[bedKey] = checked;
        }
        return updatedBed;
      });
    } else {
      setBedState({
        ...bed,
        [name]: checked,
      });
    }
  };

  return (
    <div>
      <button
        className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
        onClick={handleOpen}
      >
        Customise Tiles
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalBoxStyle}>
          <Typography id="modal-modal-title" variant="h6">
            Tile Customisation
          </Typography>
          <Typography id="modal-modal-description" variant="body1">
            Additional information to display for each patient
          </Typography>
          <Box display={"flex"}>
            <FormControl sx={{ m: 0 }}>
              <FormLabel disabled={true}>Vitals</FormLabel>
              {vitalCheckboxes.map((checkbox, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={vitals[checkbox.name]}
                      onChange={handleVitalsChange}
                      name={checkbox.name}
                    />
                  }
                  label={checkbox.label}
                />
              ))}
            </FormControl>
            <FormControl sx={{ m: 0 }}>
              <FormLabel disabled={true}>Bed</FormLabel>
              {bedCheckboxes.map((checkbox, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={bed[checkbox.name]}
                      onChange={handleBedChange}
                      name={checkbox.name}
                    />
                  }
                  label={checkbox.label}
                />
              ))}
            </FormControl>
          </Box>
          <div className="flex items-center justify-end pt-5 pb-0">
            <button
              className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
              onClick={handleSubmit}
            >
              Save Tiles Configuration
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default TileCustomisationModal;
