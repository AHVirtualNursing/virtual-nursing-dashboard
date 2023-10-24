import Image from "next/image";
import styles from "@/styles/Header.module.css";
import {useRouter} from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import ChangePasswordModal from "./ChangePasswordModal";
import {useEffect, useState} from "react";
import {VirtualNurse} from "@/models/virtualNurse";
import {fetchVirtualNurseByNurseId} from "@/pages/api/nurse_api";

export default function Header() {
  const router = useRouter();
  const {data: sessionData} = useSession();
  const [nurse, setNurse] = useState<VirtualNurse>();

  useEffect(() => {
    fetchVirtualNurseByNurseId(sessionData?.user.id).then((res) =>
      setNurse(res.data)
    );
  }, [sessionData?.user.id]);

  return (
    <div
      className="flex align-middle justify-between p-2 border-solid border-0 border-b-2 border-gray-300">
      <div className={styles.imageContainer}>
        <Image
          src={"/VND_Logo.png"}
          alt="Logo"
          fill
          priority
          onClick={() => router.push("/dashboard")}
        />
      </div>
      <div className="flex gap-5 items-center">
        <span>Welcome {nurse?.name}</span>
        <ChangePasswordModal/>
        <button className="bg-transparent border-none">
          <LogoutIcon titleAccess="Logout" onClick={() => signOut()}/>
        </button>
      </div>
    </div>
  );
}
