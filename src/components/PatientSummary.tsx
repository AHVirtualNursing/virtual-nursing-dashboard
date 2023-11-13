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
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PatientSummary = ({
  selectedWard,
  selectedTime,
}: PatientSummaryProps) => {
  const [fallRiskData, setFallRiskData] = useState<FallRiskPatientMap[]>([]);
  const [acuityData, setAcuityData] = useState<AcuityPatientMap[]>([]);
  const { data: sessionData } = useSession();

  // get all patients by selectedWard,
  // then map each fall risk and acuity level category to number of patients
  useEffect(() => {
    let acuityLevels = new Map();
    acuityLevels.set("L1", 0);
    acuityLevels.set("L2", 0);
    acuityLevels.set("L3", 0);

    let fallRisks = new Map();
    fallRisks.set("High", 0);
    fallRisks.set("Medium", 0);
    fallRisks.set("Low", 0);

    fetchWardsByVirtualNurse(sessionData?.user.id).then((wards) => {
      let wardsToView = [];
      if (selectedWard === "assigned-wards") {
        wardsToView = wards;
      } else {
        wardsToView = wards.filter(
          (ward: Ward) => ward.wardNum === selectedWard
        );
      }

      let promises: any[] = [];

      wardsToView.map((ward: Ward) =>
        promises.push(fetchBedsByWardId(ward._id))
      );

      Promise.all(promises).then((res) => {
        const beds: SmartBed[] = [].concat(...res);
        for (const bed of beds) {
          if (bed.bedStatus !== "occupied") continue;
          const { patient } = bed;

          const num1 = fallRisks.get((patient as Patient)?.fallRisk);
          fallRisks.set((patient as Patient)?.fallRisk, num1 + 1);

          const num2 = acuityLevels.get((patient as Patient)?.acuityLevel);
          acuityLevels.set((patient as Patient)?.acuityLevel, num2 + 1);
        }

        setFallRiskData(
          Array.from(fallRisks, ([name, value]) => ({ name, value }))
        );
        setAcuityData(
          Array.from(acuityLevels, ([name, value]) => ({ name, value }))
        );
      });
    });
  }, [selectedWard, sessionData?.user.id]);

  return (
    <div className="flex flex-col w-1/2 h-full p-4 gap-y-4">
      <h3 className="text-center">Patients Summary</h3>
      <div className="flex">
        <div>
          <p className="underline">Fall Risk of Patients</p>
          <PieChart title="Fall Risks" width={300} height={200}>
            <Pie
              isAnimationActive={false}
              data={fallRiskData}
              cx="60%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                entry.value === 0 ? "" : entry.name + ", " + entry.value
              }
              outerRadius={60}
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
          <p className="underline">Acuity Level of Patients</p>

          <PieChart title="Acuity Levels" width={300} height={200}>
            <Pie
              isAnimationActive={false}
              data={acuityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) =>
                entry.value === 0 ? "" : entry.name + ", " + entry.value
              }
              outerRadius={60}
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
