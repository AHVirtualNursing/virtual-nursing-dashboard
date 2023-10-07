import PendingFollowUps from "@/components/PendingFollowUps";
import Patients from "@/components/Patients";
import Summary from "@/components/Summary";

export default function Dashboard() {
  return (
    <div className="flex flex-col p-8 gap-8 bg-blue-100 w-full shadow-lg">
      <h4>Virtual Nurse Dashboard</h4>
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
