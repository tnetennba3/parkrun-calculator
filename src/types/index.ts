export type Parkrun = keyof typeof import("@/data/uk_parkrun_sss").sss;

export type ParkrunResult = {
  date: string;
  parkrun: Parkrun;
  time: number;
};

export type AdjustedParkrunResult = ParkrunResult & { originalTime?: number };

export type ParkrunData = { firstName: string; results: ParkrunResult[] };
