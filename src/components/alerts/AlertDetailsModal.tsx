import { Alert, AlertVitals } from "@/types/alert";
import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";

type AlertPatientMapping = {
  alert: Alert;
  patient: string;
};

type AlertDetailsModalProps = {
  pressed: boolean;
  setShown: Function;
  alertPatientMapping?: AlertPatientMapping | undefined;
  alert?: Alert;
  patient?: string;
};

const AlertDetailsModal = ({
  pressed,
  setShown,
  alertPatientMapping,
  alert,
  patient,
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
    maxHeight: "500px",
    overflow: "auto",
  };

  const patientName = alertPatientMapping?.patient;
  const { status, alertVitals, description, handledBy, createdAt, notes } =
    alertPatientMapping?.alert || alert || {};
  const name = patient;

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
        <div className="overflow-auto scrollbar absolute p-4 max-h-[600px] border-2 border-solid top-1/4 left-1/4  shadow-lg bg-gray-200 w-[700px] space-y-4 ">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-7">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Alert Details
              </Typography>

              <p
                className={`${
                  status === "open" ? "text-red-500" : "text-orange-500"
                } uppercase text-lg font-extrabold`}
              >
                {status}
              </p>
            </div>
            <CancelIcon fontSize="small" onClick={handleClose} />
          </div>
          <div className="space-y-6">
            <div className="flex flex-col font-bold text-lg gap-y-3">
              {patientName && <p>{patientName}</p>}
              Nurse: {handledBy ? handledBy?.addedBy : "-"}
              <p className="font-bold">
                {createdAt?.replace("T", " ").substring(0, 16)}
              </p>
            </div>

            <div className="flex gap-x-8">
              <div
                id="vitals-card"
                className="bg-blue-100 rounded-lg shadow-lg p-3 flex flex-col space-y-3 overflow-auto scrollbar"
              >
                <h4>Vitals</h4>
                <hr />
                {alertVitals &&
                  alertVitals.map((alert, index) => (
                    <div
                      key={index}
                      className="flex gap-x-10 p-3 justify-between"
                    >
                      <p>{(alert as AlertVitals).vital}</p>
                      <p className="font-bold">
                        {(alert as AlertVitals).reading}
                      </p>
                    </div>
                  ))}
              </div>
              <div
                id="vertical-card-container"
                className="flex flex-col grow gap-y-3"
              >
                <div
                  id="description-card"
                  className="bg-yellow-200 p-3 space-y-3 overflow-y-auto scrollbar"
                >
                  <h4>Description</h4>
                  <hr />
                  <p>{description}</p>
                </div>
                <div
                  id="notes-card"
                  className="bg-orange-200 p-3 space-y-3 overflow-auto scrollbar"
                >
                  <h4>Notes</h4>
                  <hr />
                  <p className="text-lg">
                    Notes:{" "}
                    {notes && notes.length > 0
                      ? notes.map((note, index) => (
                          <p key={index}>{note.info}</p>
                        ))
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
            {/* <p className="text-gray-600">{description}</p>
            <p className="text-lg">
            Nurse: {handledBy ? handledBy?.addedBy : "-"}
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
              className="float-right p-2 mx-2 rounded-lg bg-white text-black"
              onClick={handleClose}
            >
              Close
            </button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlertDetailsModal;
