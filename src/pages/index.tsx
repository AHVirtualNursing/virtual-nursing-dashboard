import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Button from "@mui/material/Button";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Home Page</h1>
        <div>
          <div className={styles.imageContainer}>
            <Image src={"/VND_Logo_JPG.jpg"} alt="Logo" fill priority />
          </div>
          <div>
            <Link href="/login">
              <Button variant="contained">LOGIN</Button>
            </Link>
            <Link href="/register">
              <Button variant="contained">REGISTER</Button>
            </Link>
            <Button variant="contained" href="/dashboard">
              View Dashboard
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
