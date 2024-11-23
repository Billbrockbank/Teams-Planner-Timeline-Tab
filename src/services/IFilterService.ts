import { 
    IFilterSettings
  } from "../models";
  
export interface IFilterService {
  saveFilterSettings(filterSettings: IFilterSettings): void;

  getFilterSettings(): IFilterSettings;
}