import axios from "axios";

export const callChangePasswordApi = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const res = await axios.post(
    `http://localhost:3001/user/changePassword/${userId}`,
    {
      oldPassword: oldPassword,
      newPassword: newPassword,
    },
    {
      headers: {
        "X-UserType": "virtual-nurse",
      },
    }
  );
  return res;
};
