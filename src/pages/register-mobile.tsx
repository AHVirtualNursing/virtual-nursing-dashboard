import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CssBaseline,
  Avatar,
  Grid,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const res = await axios.post(
        "http://localhost:3001/nurse",
        {
          name: name,
          username: name,
          email: email,
          password: password,
        }
      );

      if (res.status === 201) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      setShowErrorMessage(true);
      console.log(err);
    }
  };

  return (
    <div>
      <div className={styles.imageContainer}>
        <Image src={"/VND_Logo_JPG.jpg"} alt="Logo" fill priority />
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register New Mobile Nurse
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={showErrorMessage}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Register
            </Button>
            <Button
              fullWidth
              onClick={() => router.push("/")}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Home
            </Button>
            {showSuccessMessage ? (
              <Grid>
                <p className="text-green-600">
                  New mobile nurse created. Redirecting to home page..
                </p>
              </Grid>
            ) : null}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
