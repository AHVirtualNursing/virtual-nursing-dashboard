import axios from "axios";

const userType = "virtual-nurse";
const headers = {
  "x-usertype": userType,
};

interface layout {
  [key: string]: boolean;
  allVitals: boolean;
  hr: boolean;
  rr: boolean;
  spo2: boolean;
  bp: boolean;
  temp: boolean;
  news2: boolean;
  allBedStatuses: boolean;
  rail: boolean;
  exit: boolean;
  lowestPosition: boolean;
  brake: boolean;
  weight: boolean;
  fallRisk: boolean;
}

export const fetchVirtualNurseByNurseId = async (
  nurseId: string | string[] | undefined
) => {
  try {
    const res = await axios.get(`http://localhost:3001/user/${nurseId}`, {
      headers,
    });
    // console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

// this function fetches
// all wards assigned to virtual nurse,
export const fetchWardsByVirtualNurse = async (
  nurseId: string | string[] | undefined
) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/virtualNurse/${nurseId}/wards`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateVirtualNurseCardLayoutByNurseId = async (
  nurseId: string | string[] | undefined,
  cardLayout: layout
) => {
  try {
    const res = await axios.put(`http://localhost:3001/virtualNurse/${nurseId}`, {
      cardLayout: cardLayout,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
