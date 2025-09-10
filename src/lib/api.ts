import axios from "axios";

import { ParkrunData } from "@/types";

export const getParkrunResults = async (parkrunId: string) => {
  const { data } = await axios.get<ParkrunData>(
    `/api/parkrunners/${parkrunId}`,
  );
  return data;
};
