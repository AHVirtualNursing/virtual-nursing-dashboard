import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import {
  Container,
  Typography,
  Box,
  Grid,
  Link,
  TextField,
  Button,
  CssBaseline,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const identifier = data.get("identifier") as string;
    const password = data.get("password") as string;

    try {
      const res = await signIn("credentials", {
        identifier: identifier,
        password: password,
        redirect: false,
      });

      if (res != undefined && res.status == 200) {
        router.push("/dashboard");
      } else {
        alert("Wrong credentials");
      }
    } catch (error) {
      console.log(error);
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
            Sign in
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
              id="identifier"
              label="Email Address or Username"
              name="identifier"
              autoComplete="email"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

LoginPage.requireAuth = false;
export default LoginPage;
