import { 
    IFilterSettings
  } from "../models";
  
export interface IFilterService {
  saveFilterSettings(pageID: string, filterSettings: IFilterSettings): void;

  getFilterSettings(pageID: string): IFilterSettings;
}