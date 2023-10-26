import axios from "axios";

const userType = "virtual-nurse";
const headers = {
  "x-usertype": userType,
};

export const fetchVirtualNurseByNurseId = async (
  nurseId: string | string[] | undefined
) => {
  try {
    const res = await axios.get(`http://localhost:3001/user/${nurseId}`, {
      headers,
    });
    console.log(res);
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
