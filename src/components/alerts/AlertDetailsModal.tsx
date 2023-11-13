import { Alert, AlertVitals } from "@/types/alert";
import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";

type AlertPatientMapping = {
  alert: Alert;
  patient: string;
};

type AlertDetailsModalProps = {
  pressed: boolean;
  setShown: Function;
  alertPatientMapping: AlertPatientMapping | undefined;
};

const AlertDetailsModal = ({
  pressed,
  setShown,
  alertPatientMapping,
}: AlertDetailsModalProps) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
  };

  const patientName = alertPatientMapping?.patient;
  const { status, alertVitals, description, handledBy, createdAt, notes } =
    alertPatientMapping?.alert || {};

  const [open, setOpen] = useState(pressed);
  const handleClose = () => {
    setOpen(false);
    setShown(false);
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Alert Details
          </Typography>
          <div className="space-y-6">
            <div className="flex justify-between items-center font-bold text-lg">
              <p>{patientName}</p>
              <p
                className={`${
                  status === "open" ? "text-red-500" : "text-orange-500"
                } uppercase`}
              >
                {status}
              </p>
            </div>
            <p className="text-gray-600">{description}</p>
            <p className="text-lg">
              Nurse: {handledBy ? handledBy.addedBy : "-"}
            </p>
            <p className="text-lg">
              Notes:{" "}
              {notes && notes.length > 0
                ? notes.map((note, index) => <p key={index}>{note.info}</p>)
                : "-"}
            </p>
            <p className="text-lg">
              Time: {createdAt?.replace("T", " ").substring(0, 16)}
            </p>
            <div className="space-y-4 text-md">
              <h4>Abnormal Vitals</h4>
              {alertVitals &&
                alertVitals.map((alert, index) => (
                  <div
                    key={index}
                    className="flex gap-x-10 border-solid border-0 border-b-2 p-3"
                  >
                    <p>{(alert as AlertVitals).vital}</p>
                    <p className="font-bold">
                      {(alert as AlertVitals).reading}
                    </p>
                  </div>
                ))}
            </div>
            <button
              className="float-right p-2 rounded-lg bg-blue-900 text-white"
              onClick={handleClose}
            >
              Redelegate
            </button>
            <button
              className="float-right p-2 mx-2 rounded-lg bg-white text-black"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AlertDetailsModal;
