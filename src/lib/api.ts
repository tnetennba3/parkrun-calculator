import axios from "axios";

import { ParkrunResult } from "@/types";

export const getParkrunResults = async (parkrunId: string) => {
  const { data } = await axios.get<ParkrunResult[]>(
    `/api/parkrunners/${parkrunId}`,
  );
  return data;
};
