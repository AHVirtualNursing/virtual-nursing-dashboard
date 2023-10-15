import Image from "next/image";
import styles from "@/styles/Header.module.css";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Header() {
  const router = useRouter();
  return (
    <div className={styles.header}>
      <div className={styles.imageContainer}>
        <Image
          src={"/VND_Logo.png"}
          alt="Logo"
          fill
          priority
          onClick={() => router.push("/dashboard")}
        />
      </div>
      <div className="flex gap-5">
        {/* <LockResetIcon titleAccess="Reset Password" /> */}
        <ChangePasswordModal />
        <button className="bg-transparent border-none">
          <LogoutIcon titleAccess="Logout" onClick={() => signOut()} />
        </button>
      </div>
    </div>
  );
}
