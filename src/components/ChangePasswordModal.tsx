import { useEffect, useState } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import { callChangePasswordApi } from "@/pages/api/user";
import { Typography, Box, TextField, Button, Modal } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { VirtualNurse } from "@/models/virtualNurse";
import { fetchVirtualNurseByNurseId } from "@/pages/api/nurse_api";
import { ModalBoxStyle } from "@/styles/StyleTemplates";

export default function ChangePasswordModal() {
  const { data: sessionData } = useSession();
  const [nurse, setNurse] = useState<VirtualNurse>();
  useEffect(() => {
    fetchVirtualNurseByNurseId(sessionData?.user.id).then((res) => {
      setNurse(res.data);
    });
  }, []);

  useEffect(() => {
    if (nurse !== undefined) {
      if (!nurse.passwordReset) {
        console.log(nurse.passwordReset);
        console.log("RAN");
        setOpen(true);
      }
    }
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showWrongPasswordErrorText, setShowWrongPasswordErrorText] =
    useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const { data: session } = useSession();

  async function changePassword() {
    if (newPassword !== confirmNewPassword) {
      setErrorText("Passwords do not match");
    } else if (newPassword.length < 8) {
      setErrorText("Password must be more than 8 characters long");
    } else if (oldPassword == newPassword) {
      setErrorText("New password cannot be the same as old password");
    } else {
      setErrorText("");
      setShowWrongPasswordErrorText(false);

      try {
        if (session != undefined) {
          const res = await callChangePasswordApi(
            session.user.id,
            oldPassword,
            newPassword
          );

          if (res.status == 200) {
            setShowSuccessText(true);

            setTimeout(() => {
              signOut();
            }, 1500);
          }
        }
      } catch (error: any) {
        if (error.response.data.message == "Old password is incorrect") {
          setShowWrongPasswordErrorText(true);
        } else {
          setErrorText("Failed to change password");
        }
      }
    }
  }

  return (
    <div>
      <button className="bg-transparent border-none" onClick={handleOpen}>
        <LockResetIcon titleAccess="Change Password" />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalBoxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Password
          </Typography>
          <form>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              margin="normal"
              value={oldPassword}
              error={showWrongPasswordErrorText}
              helperText={showWrongPasswordErrorText ? "Wrong password" : ""}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              error={errorText != ""}
              helperText={errorText}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmNewPassword}
              error={errorText != ""}
              helperText={errorText}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            {showSuccessText ? (
              <Typography variant="body1" color="green">
                Password successfully changed.
              </Typography>
            ) : null}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                marginTop: "16px",
              }}
            >
              <Button variant="outlined" onClick={() => changePassword()}>
                CONFIRM
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
