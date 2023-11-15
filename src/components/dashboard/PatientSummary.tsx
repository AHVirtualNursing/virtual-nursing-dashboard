import { SmartBed } from "@/types/smartbed";
import { fetchBedsByWardId } from "@/pages/api/wards_api";
import { Patient } from "@/types/patient";
import { Ward } from "@/types/ward";
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import { useSession } from "next-auth/react";
import { fetchWardsByVirtualNurse } from "@/pages/api/nurse_api";

type FallRiskPatientMap = {
  name: string;
  value: number;
};

type AcuityPatientMap = {
  name: string;
  value: number;
};

type PatientSummaryProps = {
  selectedWard: string;
  selectedTime: string;
  wards: Ward[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PatientSummary = ({
  selectedWard,
  selectedTime,
  wards,
}: PatientSummaryProps) => {
  const [fallRiskData, setFallRiskData] = useState<FallRiskPatientMap[]>([]);
  const [acuityData, setAcuityData] = useState<AcuityPatientMap[]>([]);
  const [patients, setPatients] = useState<number>(0);
  const { data: sessionData } = useSession();

  // get all patients by selectedWard,
  // then map each fall risk and acuity level category to number of patients
  useEffect(() => {
    let acuityLevels = new Map();
    acuityLevels.set("L1", 0);
    acuityLevels.set("L2", 0);
    acuityLevels.set("L3", 0);
    acuityLevels.set("Pending Nurse Input", 0);

    let fallRisks = new Map();
    fallRisks.set("High", 0);
    fallRisks.set("Medium", 0);
    fallRisks.set("Low", 0);
    fallRisks.set("Pending Nurse Input", 0);

    let numPatients = 0;

    let wardsToView: Ward[] = [],
      wardPatientsPromises: any[] = [];
    if (selectedWard === "") {
      wardsToView = wards;
    } else {
      wardsToView = wards.filter((ward) => ward.wardNum === selectedWard);
    }

    wardPatientsPromises = wardsToView.map((ward) =>
      fetchBedsByWardId(ward._id)
    );

    Promise.all(wardPatientsPromises).then((res) => {
      const beds: SmartBed[] = [].concat(...res);
      for (const bed of beds) {
        if (bed.bedStatus !== "occupied") continue;
        const { patient } = bed;
        numPatients += 1;
        const num1 = fallRisks.get((patient as Patient)?.fallRisk);
        fallRisks.set((patient as Patient)?.fallRisk, num1 + 1);

        const num2 = acuityLevels.get((patient as Patient)?.acuityLevel);
        acuityLevels.set((patient as Patient)?.acuityLevel, num2 + 1);
      }
      console.log(fallRisks);
      setFallRiskData(
        Array.from(fallRisks, ([name, value]) => ({
          name,
          value,
        }))
      );
      console.log(fallRisks);
      setAcuityData(
        Array.from(acuityLevels, ([name, value]) => ({ name, value }))
      );

      setPatients(numPatients);
    });
  }, [selectedWard, sessionData?.user.id, wards]);

  return (
    <div className="flex flex-col w-1/2 p-1 gap-y-2">
      <h4 className="text-left">Patients Summary</h4>
      <p className="text-left font-bold text-sm">Total Patients: {patients}</p>
      <div className="flex gap-x-5">
        <div>
          <p className="underline text-sm">Fall Risk of Patients</p>
          <PieChart title="Fall Risks" width={300} height={140}>
            <Pie
              isAnimationActive={false}
              data={fallRiskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                entry.value === 0
                  ? ""
                  : entry.name.includes("Pending")
                  ? "Pending, " + entry.value
                  : entry.name + ", " + entry.value
              }
              outerRadius={50}
              dataKey="value"
            >
              {fallRiskData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div>
          <p className="underline text-sm">Acuity Level of Patients</p>

          <PieChart title="Acuity Levels" width={300} height={140}>
            <Pie
              isAnimationActive={false}
              data={acuityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                entry.value === 0
                  ? ""
                  : entry.name.includes("Pending")
                  ? "Pending, " + entry.value
                  : entry.name + ", " + entry.value
              }
              outerRadius={50}
              dataKey="value"
            >
              {acuityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
