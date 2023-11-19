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
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
    maxHeight: "500px",
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
        <div className="absolute p-4 max-h-[600px] -translate-x-1/2 -translate-y-1/2 border-2 border-solid shadow-lg bg-slate-100 space-y-3 rounded-xl top-1/2 left-1/2 w-[900px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-4">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Alert Details
              </Typography>

              <button
                className={`${
                  status === "open"
                    ? "bg-red-400"
                    : status === "handling"
                    ? "bg-orange-400"
                    : "bg-green-400"
                } text-white font-black py-1 px-3 border-none rounded-lg w-auto uppercase pointer-events-none`}
              >
                {status}
              </button>
            </div>
            <CancelIcon fontSize="small" onClick={handleClose} />
          </div>
          <div className="flex flex-col font-bold text-lg gap-y-2">
            {patientName && <p>{patientName}</p>}
            <div className="flex justify-between">
              Nurse: {handledBy ? handledBy?.addedBy : "-"}
              <p className="font-bold">
                {createdAt?.replace("T", " ").substring(0, 16)}
              </p>
            </div>
          </div>

          <div className="flex gap-x-8">
            <div
              id="vitals-card"
              className="bg-white rounded-lg shadow-lg max-h-84 p-3 flex flex-col space-y-3 overflow-y-auto scrollbar"
            >
              <h4 className="text-md font-serif">Vitals</h4>
              <hr />
              {alertVitals && alertVitals.length > 0
                ? alertVitals.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-x-8 p-3 justify-between"
                    >
                      <p>{(alert as AlertVitals).vital}</p>
                      <p className="font-bold">
                        {(alert as AlertVitals).reading}
                      </p>
                    </div>
                  ))
                : "-"}
            </div>
            <div
              id="vertical-card-container"
              className="flex flex-col grow gap-y-5"
            >
              <div
                id="description-card"
                className="bg-white p-3 space-y-3 overflow-y-auto scrollbar max-h-64 rounded-lg shadow-lg"
              >
                <h4 className="text-md font-serif">Description</h4>
                <hr />
                <p>{description}</p>
              </div>
              <div
                id="notes-card"
                className="bg-white p-3 space-y-3 overflow-auto scrollbar rounded-lg shadow-lg max-h-80"
              >
                <h4 className="text-md font-serif">Notes</h4>
                <hr />
                <p>
                  {notes && notes.length > 0
                    ? notes
                        .sort(
                          (a, b) =>
                            +new Date(b.datetime) - +new Date(a.datetime)
                        )
                        .map((note, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-3 px-1 items-center"
                          >
                            <p className="whitespace-pre-wrap">{note.info}</p>
                            <div className="text-right">
                              <p>
                                {note.datetime
                                  .replace("T", " ")
                                  .substring(11, 16)}
                              </p>
                              <p>
                                {note.datetime
                                  .replace("T", " ")
                                  .substring(0, 10)}
                              </p>
                            </div>
                          </div>
                        ))
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlertDetailsModal;
