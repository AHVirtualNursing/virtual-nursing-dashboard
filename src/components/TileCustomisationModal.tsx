import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ModalBoxStyle } from "@/styles/StyleTemplates";
import { updateVirtualNurseCardLayoutByNurseId } from "@/pages/api/nurse_api";
import { useSession } from "next-auth/react";

interface layout {
  [key: string]: boolean;
  allVitals: boolean;
  hr: boolean;
  rr: boolean;
  spo2: boolean;
  bp: boolean;
  temp: boolean;
  news2: boolean;
  allBedStatuses: boolean;
  rail: boolean;
  warnings: boolean;
  weight: boolean;
  fallRisk: boolean;
}

interface layoutProp {
  cardLayout: layout | undefined;
  setNurse: Function;
}

function TileCustomisationModal({ cardLayout, setNurse }: layoutProp) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currLayout, setCurrLayout] = useState(cardLayout as layout);
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (cardLayout) {
      setCurrLayout(cardLayout);
    }
  }, [cardLayout]);

  const checkboxes: { name: string; label: string }[] = [
    { name: "allVitals", label: "All Vitals" },
    { name: "hr", label: "Heart Rate" },
    { name: "rr", label: "Respiratory Rate" },
    { name: "spo2", label: "SPO2" },
    { name: "bp", label: "Blood Pressure" },
    { name: "temp", label: "Temperature" },
    { name: "allBedStatuses", label: "All Bed Statuses" },
    { name: "news2", label: "NEWS2" },
    { name: "rail", label: "Patient & Rail Visuals" },
    { name: "warnings", label: "Bed Warnings" },
    { name: "weight", label: "Weight of Patient" },
    { name: "fallRisk", label: "Fall Risk of Patient" },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const updatedLayout = { ...currLayout };
    updatedLayout[name] = !updatedLayout[name];
    setCurrLayout(updatedLayout);
  };

  const handleSubmit = async () => {
    console.log("submitting");
    const res = await updateVirtualNurseCardLayoutByNurseId(
      sessionData?.user.id,
      currLayout
    );
    setNurse(res?.data);
    handleClose();
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
              {checkboxes.slice(1, 6).map((checkbox, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={currLayout?.[checkbox.name]}
                      onChange={handleChange}
                      name={checkbox.name}
                    />
                  }
                  label={checkbox.label}
                />
              ))}
            </FormControl>
            <FormControl sx={{ m: 0 }}>
              {checkboxes.slice(7, 12).map((checkbox, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={currLayout?.[checkbox.name]}
                      onChange={handleChange}
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
