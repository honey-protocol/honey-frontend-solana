import { TimestampPoint } from "../components/HoneyChart/types";

export type LendTableRow = {
  allowance: number;
  available: number;
  connection: any;
  debt: number;
  id: string;
  key: string;
  name: string;
  rate: number;
  user: any;
  utilizationRate: number;
  value: number;
  stats?: any;
};