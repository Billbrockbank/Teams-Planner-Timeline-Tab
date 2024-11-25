import { 
  IFilterSettings,
  ITimeLineData
} from '../models';
import { ITimeLineService } from '.';
import { Client } from "@microsoft/microsoft-graph-client";
import { 
  PlannerPlan,
  PlannerBucket,
  PlannerTask,
  User,
} from '@microsoft/microsoft-graph-types'

export class TimeLineService implements ITimeLineService {
  // Private members
  private _graphClient: Client;
  private _buckets: PlannerBucket[] = [];
  private _taskUsers: User[] = [];
  private _tasks: PlannerTask[] = [];

  private _timeLine: ITimeLineData = {
    groupId: "",
    planId: "",
  };

  // Constructor
  constructor(graphClient: Client, groupId: string) {
    this._graphClient = graphClient;
    this._timeLine.groupId = groupId;
  }

  public async getTimelineData(refersh: boolean): Promise<ITimeLineData> {
    const check = !refersh; 
    if (check) refersh = await this._getTimelineData();

    if (refersh) {
      try {
        const allUsers = await this._graphClient
          .api("/users")
          .select("id,displayName,mail")
          .get();

        this._taskUsers = allUsers.value;

        const plansData = await await this._graphClient
          .api(
            "/groups/" +
              this._timeLine.groupId +
              "/planner/plans?$select=id,title"
          )
          .get();

        const plans: PlannerPlan[] = plansData.value;

        console.log(plans);

        const planId = plansData.value[0].id;

        if (planId) {
          this._timeLine.planId = planId;
          const bucketsData = await await this._graphClient
            .api("/planner/plans/" + planId + "/buckets")
            .get();

          this._buckets = bucketsData.value;

          if (this._timeLine.planId) {
            const tasksData = await this._graphClient
              .api("/planner/plans/" + planId + "/Tasks")
              .orderby("dueDateTime")
              .get();

            const tasks: PlannerTask[] = tasksData.value;
            this._tasks = await this._getTaskDetails(tasks);
          }
        }
      } catch (error: any) {
        this._timeLine.error = error?.message;
      }

      this._saveTimelineData(
        this._timeLine,
        this._buckets,
        this._taskUsers,
        this._tasks
      );
    }

    return this._timeLine;
  }

  private async _getTaskDetails(tasks: PlannerTask[]): Promise<PlannerTask[]> {
    for (const task of tasks) {
      const detail = await this._graphClient
        .api("/planner/tasks/" + task.id + "/details")
        .get();

      task.details = detail;

      if (task.completedBy) {
        const user = this._taskUsers.find(
          (u) => u.id === task.completedBy?.user?.id
        );
        if (user) {
          if (task.completedBy.user) {
            task.completedBy.user.displayName = user.displayName;
          }
        }
      }

      if (task.createdBy) {
        const user = this._taskUsers.find(
          (u) => u.id === task.createdBy?.user?.id
        );
        if (user) {
          if (task.createdBy.user) {
            task.createdBy.user.displayName = user.displayName;
          }
        }
      }

      if (task.bucketId) {
        const bucket = this._buckets.find((b) => b.id === task.bucketId);
        if (bucket) {
          task.bucketId = bucket.id + ":" + bucket.name;
        }
      }
    }

    return tasks;
  }

  // Get timeline data
  public getTimeLine(): ITimeLineData {
    return this._timeLine;
  }

  // Get Planner buckets
  public getBuckets(): PlannerBucket[] {
    return this._buckets;
  }

  // Get tenant users
  public getTaskUsers(): User[] {
    return this._taskUsers;
  }

  // Get Planner tasks
  public getTasks(sortBy: string): PlannerTask[] {
    if (sortBy.toLowerCase() === "duedate") {
      return this._sortTasksByDueDate(this._tasks);
    } else if (sortBy.toLowerCase() === "stratdate") {
      return this._sortTasksByStartDate(this._tasks);
    } else {
      return this._tasks;
    }
  }

  // Get active tasks
  public getActiveTasks(sortBy: string): PlannerTask[] {
    const orderedTasks = this.getTasks(sortBy);

    return orderedTasks.filter((task) => {
      return !task.completedDateTime;
    });
  }

  // Get tasks sort by start date
  private _sortTasksByStartDate(tasks: PlannerTask[]): PlannerTask[] {
    tasks = tasks.sort((a, b) => {
      if (a.startDateTime && b.startDateTime) {
        return a.startDateTime.localeCompare(b.startDateTime);
      } else {
        return 0;
      }
    });

    return tasks;
  }

  // get tasks sort by due date
  private _sortTasksByDueDate(tasks: PlannerTask[]): PlannerTask[] {
    tasks = tasks.sort((a, b) => {
      if (a.dueDateTime && b.dueDateTime) {
        return a.dueDateTime.localeCompare(b.dueDateTime);
      } else {
        return 0;
      }
    });

    return tasks;
  }

  public getTasksForBucket(fileterSettings: IFilterSettings): PlannerTask[] {
    let tasks: PlannerTask[] = [];

    if (fileterSettings.showActiveTasks) {
      tasks = this.getTasks("dueDate");
    } else {
      tasks = this.getActiveTasks("dueDate");
    }

    if (fileterSettings.bucketId !== "All" && fileterSettings.bucketId !== "") {
      const filteredTasks: PlannerTask[] = [];

      tasks.forEach((task) => {
        if (task.bucketId && task.bucketId.startsWith(fileterSettings.bucketId)) {
          filteredTasks.push(task);
        }
      });

      return filteredTasks;
    }

    return tasks;
  }

  // Get timeline data from session storage
  private async _getTimelineData(): Promise<boolean> {
    const timelineData = sessionStorage.getItem("_TimelineData");

    if (timelineData) {
      const buckets = sessionStorage.getItem("_buckets");
      const Users = sessionStorage.getItem("_Users");
      const tasks = sessionStorage.getItem("_tasks");
      const timelineDataString = sessionStorage.getItem("_pmsTimelineData");

      if (timelineDataString) {
        const dataTime: Date = new Date(timelineDataString.replace(/"/g, ""));
        const nowTime: Date = new Date();
        const deplay: number =
          (nowTime.getTime() - dataTime.getTime()) / (1000 * 60);

        if (deplay < 30) {
          this._timeLine = JSON.parse(timelineData) as ITimeLineData;
          this._buckets = buckets
            ? (JSON.parse(buckets) as PlannerBucket[])
            : [];
          this._taskUsers = Users ? (JSON.parse(Users) as User[]) : [];
          this._tasks = tasks ? (JSON.parse(tasks) as PlannerTask[]) : [];

          return false;
        }
      }
    }

    return true;
  }

  // Save timeline data to session storage
  private async _saveTimelineData(
    timelineData: ITimeLineData,
    buckets: PlannerBucket[],
    Users: User[],
    tasks: PlannerTask[]
  ) {
    sessionStorage.setItem("_TimelineData", JSON.stringify(timelineData));
    sessionStorage.setItem("_buckets", JSON.stringify(buckets));
    sessionStorage.setItem("_Users", JSON.stringify(Users));
    sessionStorage.setItem("_tasks", JSON.stringify(tasks));
    sessionStorage.setItem("_pmsTimelineData", JSON.stringify(new Date()));
  }
}

