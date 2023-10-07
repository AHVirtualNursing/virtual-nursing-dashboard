import Image from "next/image";
import styles from "@/styles/Header.module.css";
import { useRouter } from "next/navigation";

export default function Header() {
  // const router = useRouter();
  return (
    <div className={styles.header}>
      <div className={styles.imageContainer}>
        <Image
          src={"/VND_Logo.png"}
          alt="Logo"
          fill
          priority
          // onClick={() => router.push("/dashboard")}
        />
      </div>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-logout"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#2c3e50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
          <path d="M9 12h12l-3 -3" />
          <path d="M18 15l3 -3" />
        </svg>
      </span>
    </div>
  );
}
