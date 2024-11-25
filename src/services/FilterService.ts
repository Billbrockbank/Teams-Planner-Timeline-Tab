import { IFilterSettings } from '../models';
import { IFilterService } from './IFilterService';

// FilterService class implements IFilterService interface
export class FilterService implements IFilterService {
  // private variable to store filter settings
  private _filterSettings: IFilterSettings;

  // constructor to initialize filter settings
  constructor(filterSettings: IFilterSettings) {
    // set filter settings
    this._filterSettings = filterSettings;
  }

  // save filter settings in session storage
  public saveFilterSettings(filterSettings: IFilterSettings) {
    // save filter settings in session storage
    this._filterSettings = filterSettings;    

    // save filter settings in session storage
    sessionStorage.setItem("_TimeLineFilterData", JSON.stringify(this._filterSettings));
    // save filter settings time in session storage
    sessionStorage.setItem("_pmsFilterTime", JSON.stringify(new Date()));
  }

  // get filter settings from session storage
  public getFilterSettings(): IFilterSettings {
    // get filter settings from session storage
    const fliterData = sessionStorage.getItem("_TimeLineFilterData");

    // check if filter settings are available
    if (fliterData) {
      // parse filter settings 
      const fliterDataString = sessionStorage.getItem("_pmsFilterTime");

      // check if filter settings time is available
      if (fliterDataString) {
        const filter = JSON.parse(fliterData);
        // parse filter settings time
        const dataTime: Date = new Date(fliterDataString.replace(/"/g, ""));
        // get current time
        const nowTime: Date = new Date();
        // calculate delay
        const deplay: number = (nowTime.getTime() - dataTime.getTime()) / (1000 * 60);

        // check if delay is less than 30 minutes
        if (deplay < 30) {
          // create filter settings object
          const filterSet: IFilterSettings = {
            bucketId: filter.bucketId,
            showActiveTasks: filter.showActiveTasks === true
          };

          // return filter settings
          this._filterSettings = filterSet;          
        }
      }
    }

    return this._filterSettings;
  }
}