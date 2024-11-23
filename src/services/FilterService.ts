import { IFilterSettings } from '../models';
import { IFilterService } from './IFilterService';

export class FilterService implements IFilterService {
  private _filterSettings: IFilterSettings;

  constructor(filterSettings: IFilterSettings) {
    this._filterSettings = filterSettings;
  }

  public saveFilterSettings(filterSettings: IFilterSettings) {
    this._filterSettings = filterSettings;    

    sessionStorage.setItem("_TimeLineFilterData", JSON.stringify(this._filterSettings));
    sessionStorage.setItem("_pmsFilterTime", JSON.stringify(new Date()));
  }

  public getFilterSettings(): IFilterSettings {
    const fliterData = sessionStorage.getItem("_TimeLineFilterData");

    if (fliterData) {
      const fliterDataString = sessionStorage.getItem("_pmsFilterTime");

      if (fliterDataString) {
        const filter = JSON.parse(fliterData);
        const dataTime: Date = new Date(fliterDataString.replace(/"/g, ""));
        const nowTime: Date = new Date();
        const deplay: number = (nowTime.getTime() - dataTime.getTime()) / (1000 * 60);

        if (deplay < 30) {
          const filterSet: IFilterSettings = {
            bucketId: filter.bucketId,
            showActiveTasks: filter.showActiveTasks === true,
            refreshData: filter.refreshData === true,
          };

          this._filterSettings = filterSet;          
        }
      }
    }

    return this._filterSettings;
  }
}