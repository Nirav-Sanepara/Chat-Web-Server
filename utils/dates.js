import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

// Returns the current timestamp in epoch format
export const getCurrentTimeStamp = () => {
  return dayjs().utc().valueOf();
};
