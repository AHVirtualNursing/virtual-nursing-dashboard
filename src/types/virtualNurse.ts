export type VirtualNurse = {
  _id: string;
  username: string;
  passwordReset: boolean;
  name: string;
  ward?: string[];
};
