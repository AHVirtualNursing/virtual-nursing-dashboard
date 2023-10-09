import { VirtualNurse } from "@/models/virtualNurse";
import { fetchVirtualNurseByNurseId } from "@/pages/api/nurse_api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactElement;
};

export const PasswordProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [nurse, setNurse] = useState<VirtualNurse>();

  useEffect(() => {
    fetchVirtualNurseByNurseId(sessionData?.user.id).then((res) => {
      setNurse(res.data);
    });
  }, []);

  useEffect(() => {
    console.log(nurse);
  }, [nurse]);

  // password reset logic handled in change password modal

  return <div>{children}</div>;
};
