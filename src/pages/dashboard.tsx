import PendingFollowUps from "@/components/PendingFollowUps";
import Patients from "@/components/Patients";
import Summary from "@/components/Summary";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("assigned-wards");

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
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="assigned-wards">Beds in Assigned Wards</option>
          <option value="all-wards">Beds in All Wards</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl h-2/6 p-4 flex shadow-lg ">
        <PendingFollowUps />
        <Summary />
      </div>
      <div className="bg-white rounded-2xl h-4/6 p-3 shadow-lg">
        <Patients />
      </div>
    </div>
  );
}
