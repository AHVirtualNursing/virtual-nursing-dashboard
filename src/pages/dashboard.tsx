import Patients from "@/components/patients";

export default function Dashboard() {
  return (
    <div className="flex flex-col p-3 gap-4 bg-blue-100 w-5/6 shadow-lg">
      <h1>Virtual Nurse Dashboard</h1>
      <div className="bg-blue-200 rounded-md h-1/4">div1</div>
      <div className="bg-red-200 rounded-md h-3/4 p-3 shadow-lg">
        <Patients />
      </div>
    </div>
  );
}
