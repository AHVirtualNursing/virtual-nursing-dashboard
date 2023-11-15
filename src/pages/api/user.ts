import axios from "axios";

export const callChangePasswordApi = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/user/changePassword/${userId}`,
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
