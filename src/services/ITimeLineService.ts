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
  getTimelineData(): Promise<ITimeLineData>;

  refreshTasks(): Promise<ITimeLineData>;

  getTimeLine(): ITimeLineData;

  getBuckets(): PlannerBucket[];

  getActiveTasks(sortBy: string): PlannerTask[];

  getTasks(sortBy: string): PlannerTask[];

  getTaskUsers(): User[];

  getTasksForBucket(fileterSettings: IFilterSettings): PlannerTask[];
}
