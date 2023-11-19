import { InfoLog } from "@/models/infoLog";
import { Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

type PatientInfoModalProps = {
  pressed: boolean;
  setShown: Function;
  infoLogs: InfoLog[];
};

const PatientInfoModal = ({
  pressed,
  setShown,
  infoLogs,
}: PatientInfoModalProps) => {
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
        <div className="absolute p-4 max-h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 border-2 border-solid shadow-lg bg-slate-100 space-y-3 rounded-xl top-1/2 left-1/2 overflow-auto scrollbar">
          <div className="flex justify-between items-center">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Addtional Notes
            </Typography>
            <CancelIcon fontSize="small" onClick={handleClose} />
          </div>
          <div>
            <div className="flex flex-col">
              {infoLogs?.length > 0
                ? infoLogs?.map((info, index) => (
                    <div key={index}>
                      <div className="flex justify-between p-4">
                        <p>{info.info}</p>
                        <div className="text-right">
                          <p>{info.addedBy}</p>
                          <p>{info.datetime}</p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))
                : "No additional notes added"}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientInfoModal;
