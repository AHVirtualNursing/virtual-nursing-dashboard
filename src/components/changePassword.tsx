import { Typography, Box, TextField, Button, Modal } from "@mui/material";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { modalStyle } from "./styles/style";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showSuccessText, setShowSuccessText] = useState(false);

  const { data: session } = useSession();

  async function changePassword() {
    if (newPassword !== confirmNewPassword) {
      setErrorText("Passwords do not match");
    } else {
      setErrorText("");
      try {
        if (session != undefined) {
          const res = await axios.post(
            `http://localhost:3001/user/changePassword/${session.user.id}`,
            {
              oldPassword: oldPassword,
              newPassword: newPassword,
            },
            {
              headers: {
                "X-UserType": "virtual-nurse",
              },
            }
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
          setErrorText("Wrong password");
        } else {
          setErrorText("Failed to change password");
        }
      }
    }
  }

  return (
    <Box sx={modalStyle}>
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
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
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
          }}>
          <Button variant="outlined" onClick={() => changePassword()}>
            CONFIRM
          </Button>
          <Button
            variant="outlined"
            onClick={() => setChangePasswordModalOpen(false)}>
            BACK
          </Button>
        </Box>
      </form>
    </Box>
  );
}
