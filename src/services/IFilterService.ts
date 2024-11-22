import { 
    IFilterSettings
  } from "../models";
  
export interface IFilterService {
  saveFilterSettings(bucketId: string, showActiveTasks: boolean): void;

  getFilterSettings(): IFilterSettings;
}