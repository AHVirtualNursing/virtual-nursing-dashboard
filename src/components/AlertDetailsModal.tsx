import { Alert } from "@/types/alert";
import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";

type AlertPatientMapping = {
  alert: Alert;
  patient: string;
};

type AlertDetailsModalProps = {
  pressed: boolean;
  setShown: Function;
  alertPatientMapping: AlertPatientMapping;
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
  const { status, alertVitals, description, handledBy, createdAt } =
    alertPatientMapping?.alert;

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
          <div className="space-y-2">
            <DetailBox title="Patient:" content={patientName} />
            <DetailBox title="Status:" content={status} />
            <DetailBox title="Description:" content={description} />
            <p className="font-bold underline">Abnormal Vitals</p>
            {alertVitals.map((alert) => (
              <div className="flex gap-x-3">
                <p>{alert.vital}</p>
                <p>{alert.reading}</p>
              </div>
            ))}
            <DetailBox title="Nurse:" content={handledBy ? handledBy : "-"} />
            <DetailBox
              title="Time:"
              content={createdAt.replace("T", " ").substring(0, 16)}
            />
          </div>
          <button
            className="float-right p-2 rounded-lg bg-blue-900 text-white"
            onClick={handleClose}
          >
            Redelegate
          </button>
        </Box>
      </Modal>
    </div>
  );
};

const DetailBox = (props: { title: string; content: string }) => {
  return (
    <div className="flex gap-2">
      <p className="font-bold underline">{props.title}</p>
      <p>{props.content}</p>
    </div>
  );
};

export default AlertDetailsModal;
