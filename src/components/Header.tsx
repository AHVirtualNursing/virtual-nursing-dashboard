import Image from "next/image";
import styles from "@/styles/Header.module.css";
import { useRouter } from "next/router";

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
    </div>
  );
}
