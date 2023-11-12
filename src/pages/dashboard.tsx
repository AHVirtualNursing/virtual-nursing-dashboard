import Patients from "@/components/Patients";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchWardsByVirtualNurse } from "./api/nurse_api";
import { Ward } from "@/types/ward";
import AlertsSummary from "@/components/AlertsSummary";
import PatientSummary from "@/components/PatientSummary";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { Link } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("assigned-wards");
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
          Beds
        </label>
        <select
          name="wardSelect"
          id="ward-select"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          value={selectedOption}
          onChange={(e) => {
            console.log("selected option", e.target.value);
            setSelectedOption(e.target.value);
          }}
        >
          <option value="assigned-wards">Assigned Wards</option>
          {wards.map((ward) => (
            <option key={ward._id} value={`${ward.wardNum}`}>
              Ward {ward.wardNum}
            </option>
          ))}
        </select>

        <select
          name="timeSelect"
          id="time-select"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          value={selectedTime}
          onChange={(e) => {
            console.log("selected time", e.target.value);
            setSelectedTime(e.target.value);
          }}
        >
          <option value="today">Today</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl h-2/6 p-4 flex shadow-lg ">
        <AlertsSummary
          selectedWard={selectedOption}
          selectedTime={selectedTime}
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
