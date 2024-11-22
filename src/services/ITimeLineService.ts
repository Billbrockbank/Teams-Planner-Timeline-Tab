import { 
  ITimeLineData,
  IFilterSettings
} from "../models";
import {  
  PlannerBucket, 
  PlannerTask,
  User 
} from "@microsoft/microsoft-graph-types";

export interface ITimeLineService {
  // all inventory items
  getTimelineData(refersh: boolean): Promise<ITimeLineData>;

  getTimeLine(): ITimeLineData;

  getBuckets(): PlannerBucket[];

  getActiveTasks(sortBy: string): PlannerTask[];

  getTasks(sortBy: string): PlannerTask[];

  getTaskUsers(): User[];

  getTasksForBucket(bucketId: string, showActiveTasks: boolean): PlannerTask[];

  saveFilterSettings(bucketId: string, showActiveTasks: boolean): void;

  getFilterSettings(): IFilterSettings;
}
