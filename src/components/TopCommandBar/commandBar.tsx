import { 
  useContext, 
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import { TeamsFxContext } from "../Context";
import { Stack } from '@fluentui/react';
import { CalendarMonthRegular } from "@fluentui/react-icons";
import {
  ToggleButton, 
  Tooltip,
  Checkbox,
  Dropdown,
  Option,
  useId,  
} from '@fluentui/react-components';
import { PlannerBucket } from '@microsoft/microsoft-graph-types'
import {
  stackStyles,  
  BucketDDLabelStyle,
} from '../../Styles';

interface CommandBarProps {
  onBucketId: (params: { bucketId: string; bucketName: string }) => void;
  onAllTask: (showActiveTasks: boolean) => void;
  onTaskRefresh: (callbackFunction: (callbackFunction: any) => void) => void;
}

export default function CommandBar({ onBucketId, onAllTask, onTaskRefresh }: CommandBarProps) {
  const { renderSettings, filterSettings, configSettings, filterService } = useContext(TeamsFxContext);

  const dropdownId = useId('dropdown');
  const [showActiveTasks, setShowActiveTasks] = useState(true)
  const [bucketName, setBucketName] = useState<string>("In all buckets");  
  const [retrievingTasks, setRetrievingTasks] = useState<boolean>(false);  
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [bucketId, setBucketId] = useState<string[]>([]);  

  const clearTaskRefresh = () => {
    setRefreshData(false);    
    setRetrievingTasks(false);
    if (filterSettings)
      filterSettings.refreshData = false;
  }

  const AllTasksClick = useCallback(() => { 
    // Set the show active tasks flag
    setShowActiveTasks(!showActiveTasks);
    if (filterSettings)
      filterSettings.showActiveTasks = !showActiveTasks;

    if (filterService && filterSettings )
      filterService.saveFilterSettings(configSettings.pageId, filterSettings);

    onAllTask(!showActiveTasks);
  }, [showActiveTasks]);
  
  const PlannerBucketSelect = useCallback((event: any, data: any) => {
    if (data) {
      // Set the bucket id from selection
      const bucketId = data.optionValue || "All"

      if (filterSettings)
        filterSettings.bucketId = bucketId; 

      // Set the bucket name from selection
      const name = data.optionText || "";
      setBucketName(name);      
      
      if (filterService && filterSettings )
        filterService.saveFilterSettings(configSettings.pageId, filterSettings);

      onBucketId({ bucketId: bucketId, bucketName: name });
      setBucketId([bucketId]);
    }
  }, []);

  const DropDownPlaceHolder = useMemo(() => {
    const name = bucketName ? bucketName.replace("Bucket: ", "").replace("In all buckets", "All Buckets") : "Select a bucket";
    return name;    
  }, [bucketName]);

  const TaskRefreshClick = useCallback(() => {
    setRefreshData(!refreshData);
    setRetrievingTasks(!refreshData);

    if (filterSettings)
      filterSettings.refreshData = true
    
    onTaskRefresh(clearTaskRefresh);
  }, [refreshData]);

  // initialize the filter settings for command bar
  useEffect(() => {    
    if (filterSettings) {
      setShowActiveTasks(filterSettings.showActiveTasks);

      if (filterSettings.bucketId === 'All') {
        // Set the bucket name
        setBucketName("In all buckets");
      } else {
        // Set the bucket name
        setBucketName("Bucket: " + renderSettings?.buckets.find((bucket) => bucket.id === filterSettings.bucketId)?.name || "Unknown Bucket");
      }

      setBucketId([filterSettings.bucketId]);
    }    
  }, []);

  const dropDownOptions = useMemo(() => {
    const options = [];

    options.push(<Option key="All" value="All" text="All Buckets">All Buckets</Option>);
    renderSettings?.buckets.forEach((bucket: PlannerBucket) => {
      return options.push(<Option key={bucket.id} value={bucket.id} text={bucket.name ?? 'Unnamed Bucket'}>{bucket.name}</Option>);
    });
    
    return options;
  }, [renderSettings?.buckets]);

  return (
    <>
      { !filterSettings?.refreshData && 
        <Stack enableScopedSelectors horizontal horizontalAlign="start" styles={stackStyles}>
          <Tooltip content="Filter out completed Tasks" relationship="label">
            <div className="activeTaskscheckbox">              
              <Checkbox label="All Tasks" 
                        checked={showActiveTasks} 
                        labelPosition="before"
                        disabled={retrievingTasks}
                        onChange={AllTasksClick} />
            </div>
          </Tooltip>
          <div>
            <label className={BucketDDLabelStyle}>Planner Bucket</label>
            <Tooltip content="Task filter" relationship="label">
              <Dropdown placeholder={DropDownPlaceHolder} 
                        aria-labelledby={dropdownId}
                        disabled={retrievingTasks}
                        selectedOptions={bucketId}
                        onOptionSelect={PlannerBucketSelect} >                
                { dropDownOptions }              
              </Dropdown>
            </Tooltip>
            <Tooltip content="Refresh Timeline Tasks" relationship="label">
                <ToggleButton                  
                  style={{ width: '30px', height: '30px', marginLeft: '5px' }}                  
                  icon={<CalendarMonthRegular />}  
                  appearance="subtle"                  
                  size="medium"
                  disabled={retrievingTasks}
                  onClick={TaskRefreshClick}
                />
              </Tooltip>
          </div>        
        </Stack>
      }
    </>
  );
}
