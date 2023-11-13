import Patients from "@/components/dashboard/Patients";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchWardsByVirtualNurse } from "./api/nurse_api";
import { Ward } from "@/types/ward";
import AlertsSummary from "@/components/dashboard/AlertsSummary";
import PatientSummary from "@/components/dashboard/PatientSummary";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { Link } from "@mui/material";
import SelectFilter from "@/components/SelectFilter";

export default function Dashboard() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTime, setSelectedTime] = useState("today");
  const [wards, setWards] = useState<Ward[]>([]);
  const { data: sessionData } = useSession();
  const nurseId = sessionData && sessionData.user.id;

  useEffect(() => {
    fetchWardsByVirtualNurse(nurseId).then((wards) => {
      setWards(wards);
    });
  }, [nurseId]);

  return (
    <div className="flex flex-col p-8 gap-6 w-full shadow-lg bg-slate-100">
      <div className="flex justify-between">
        <h4>Virtual Nurse Dashboard</h4>
        <button
          className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
          onClick={() => router.push("/createPatient")}
        >
          Create Patient
        </button>
      </div>
      <div className="gap-x-3 flex justify-start items-center">
        <div>
          <button disabled className="p-0 m-0">
            <ListIcon />
          </button>
          <Link href="/wards">
            <button className="m-0 p-0">
              <GridViewIcon />
            </button>
          </Link>
        </div>
        <label
          htmlFor="ward-select"
          className="text-sm font-medium text-gray-900"
        >
          Wards
        </label>
        <SelectFilter
          name="wardFilter"
          inTable={false}
          changeSelectedOption={setSelectedOption}
          options={["all"].concat(wards.map((ward) => ward.wardNum))}
        />
        <label
          htmlFor="timeSelect"
          className="text-sm font-medium text-gray-900"
        >
          Time
        </label>
        <SelectFilter
          name="timeSelect"
          inTable={false}
          changeSelectedOption={setSelectedTime}
          options={["today", "all"]}
          defaultValue="today"
        />
      </div>
      <div className="bg-white rounded-2xl h-2/6 p-4 flex shadow-lg ">
        <AlertsSummary
          selectedWard={selectedOption}
          selectedTime={selectedTime}
          wards={wards}
        />
        <PatientSummary
          selectedWard={selectedOption}
          selectedTime={selectedTime}
        />
      </div>
      <div className="bg-white rounded-2xl h-4/6 p-3 shadow-lg">
        <Patients selectedWard={selectedOption} />
      </div>
    </div>
  );
}
