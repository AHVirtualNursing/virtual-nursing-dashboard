import PendingFollowUps from "@/components/PendingFollowUps";
import Patients from "@/components/Patients";
import Summary from "@/components/Summary";

export default function Dashboard() {
  return (
    <div className="flex flex-col p-3 gap-4 bg-blue-100 w-5/6 shadow-lg">
      <h1>Virtual Nurse Dashboard</h1>
      <div className="bg-blue-200 rounded-md h-2/6 pt-7 flex ">
        <Summary />
        <PendingFollowUps />
      </div>
      <div className="bg-red-200 rounded-md h-4/6 p-3 shadow-lg">
        <Patients />
      </div>
    </div>
  );
}
