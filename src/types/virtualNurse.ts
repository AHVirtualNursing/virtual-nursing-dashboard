import { Ward } from "./ward";
import { User } from "./user";

export interface VirtualNurse extends User {
  _id: string;
  wards?: Ward[] | string[];
  cardLayout: CardLayout;
}

export interface CardLayout {
  allVitals: boolean;
  hr: boolean;
  rr: boolean;
  spo2: boolean;
  bp: boolean;
  temp: boolean;
  news2: boolean;
  allBedStatuses: boolean;
  rail: boolean;
  warnings: boolean;
  weight: boolean;
  fallRisk: boolean;
}
