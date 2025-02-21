import { DateTime } from "luxon";

export interface Time {
  id: number;
  start?: DateTime;
  end?: DateTime;
}
