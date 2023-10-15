import axios from "axios";

const userType = 'virtual-nurse'
const headers = {
  'x-usertype': userType
}
export const fetchVirtualNurseByNurseId = async (nurseId : string | string[] | undefined) => {
  try {
    const res = await axios.get(`http://localhost:3001/user/${nurseId}`, {headers});
    console.log(res)
    return res.data;
  } catch (error) {
    console.error(error);
  }
};