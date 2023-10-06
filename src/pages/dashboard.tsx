import PendingFollowUps from "@/components/PendingFollowUps";
import Patients from "@/components/Patients";
import Summary from "@/components/Summary";

export default function Dashboard() {
  return (
    <div className="flex flex-col p-3 gap-4 bg-blue-100 w-full shadow-lg">
      <h1>Virtual Nurse Dashboard</h1>
      <div className="bg-white rounded-lg h-2/6 pt-7 flex shadow-lg ">
        <PendingFollowUps />
        <Summary />
      </div>
      <div className="bg-white rounded-lg h-4/6 p-3 shadow-lg">
        <Patients />
      </div>
    </div>
  );
}
