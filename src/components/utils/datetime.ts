import { DateTime } from "luxon";

export const convertToSingaporeTime = (datetime: string) => {
  const utcDateTime = DateTime.fromISO(datetime, {
    zone: "utc",
  });

  const sgDateTime = utcDateTime
    .setZone("Asia/Singapore")
    .toFormat("yyyy-MM-dd' 'hh:mm a");

  return sgDateTime;
};
