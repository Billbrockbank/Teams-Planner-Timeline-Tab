import { IFilterSettings } from '../models';
import { IFilterService } from './IFilterService';

export class FilterService implements IFilterService {
  private _bucketId: string;
  private _showActiveTasks: boolean;

  constructor(bucketId: string, showActiveTasks: boolean) {
    this._bucketId = bucketId;
    this._showActiveTasks = showActiveTasks;
  }

  public saveFilterSettings(bucketId: string, showActiveTasks: boolean) {
    const TimelineFilterData = {
      bucketId,
      showActiveTasks
    };

    this._bucketId = bucketId;
    this._showActiveTasks = showActiveTasks;

    sessionStorage.setItem("_TimeLineFilterData", JSON.stringify(TimelineFilterData));
    sessionStorage.setItem("_pmsFilterTime", JSON.stringify(new Date()));  
  }

  public getFilterSettings(): IFilterSettings {
    const filterSettings: IFilterSettings = {
      bucketId: this._bucketId,
      showActiveTasks: this._showActiveTasks
    };
    
    const fliterData = sessionStorage.getItem("_TimeLineFilterData");

    if(fliterData) {
      const fliterDataString = sessionStorage.getItem("_pmsFilterTime");

      if (fliterDataString) {
        const filter = JSON.parse(fliterDataString);
        const dataTime: Date = new Date(fliterData);
        const nowTime: Date = new Date();
        const deplay: number = (nowTime.getTime() - dataTime.getTime()) / (1000 * 60);
          
        if (deplay < 30) {
          filterSettings.bucketId = filter.bucketId;
          filterSettings.showActiveTasks = !filter.showActiveTasks;
        }
      }
    }

    return filterSettings;
  }
}