import PendingFollowUps from "@/components/PendingFollowUps";
import Patients from "@/components/Patients";
import Summary from "@/components/Summary";
import {useRouter} from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="flex flex-col p-8 gap-8 w-full shadow-lg bg-slate-100">
      <div className="flex justify-between">
        <h4>Virtual Nurse Dashboard</h4>
        <button
          className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
          onClick={() => router.push("/createPatient")}
        >
          Create Patient
        </button>
      </div>
      <div className="bg-white rounded-2xl h-2/6 p-4 flex shadow-lg ">
        <PendingFollowUps/>
        <Summary/>
      </div>
      <div className="bg-white rounded-2xl h-4/6 p-3 shadow-lg">
        <Patients/>
      </div>
    </div>
  );
}
