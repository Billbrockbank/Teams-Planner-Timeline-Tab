export interface ITimeLineData {
  groupId: string;
  groupName?: string;
  planId: string;
  error?: string;
}

export interface IFilterSettings {
  bucketId: string;
  showActiveTasks: boolean;
}