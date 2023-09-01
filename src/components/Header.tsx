import Image from "next/image";
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.imageContainer}>
        <Image src={"/VND_Logo.png"} alt="Logo" fill priority />
      </div>
    </div>
  );
}
