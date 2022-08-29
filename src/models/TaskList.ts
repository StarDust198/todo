import { Tag } from './Tag';
import { ITask, Task } from './Task';

export interface TaskEntities {
  [key: number]: ITask;
}

export interface ITaskList {
  tasks: TaskEntities;
  taskArr: ITask[];
  addTasks: (taskArr: ITask[]) => void;
  addTask: (taskInfo: string) => void;
  taskChangeTitle: (taskId: number, newTitle: string) => void;
  taskAddTag: (taskId: number, newTag: Tag) => void;
  taskRemoveTag: (taskId: number, tagName: string) => void;
  taskChangeDescr: (taskId: number, tagName: string) => void;
  taskMarkCompleted: (taskId: number, newDescr: string) => void;
  taskUnMarkCompleted: (taskId: number) => void;
  taskMarkDeleted: (taskId: number) => void;
  taskUnMarkDeleted: (taskId: number) => void;
}

export class TaskList implements ITaskList {
  tasks: TaskEntities = {};
  taskArr: ITask[] = [];

  addTasks(taskArr: ITask[]): void {
    taskArr.forEach((task) => (this.tasks[task.id] = task));
    this.taskArr = taskArr;
  }

  addTask(taskInfo: string) {
    const newTask = new Task(taskInfo);
    this.tasks[newTask.id] = newTask;
    this.taskArr = [...this.taskArr, newTask];
  }

  taskChangeTitle(taskId: number, newTitle: string): void {
    if (this.tasks[taskId]) this.tasks[taskId].title = newTitle;
  }

  // taskChangeDate(newDate: Date): void {
  //   this.date = newDate;
  // }

  taskAddTag(taskId: number, newTag: Tag): void {
    if (!this.tasks[taskId].tags.some((tag) => tag === newTag))
      this.tasks[taskId].tags = [...this.tasks[taskId].tags, newTag];
  }

  taskRemoveTag(taskId: number, tagName: string): void {
    this.tasks[taskId].tags = this.tasks[taskId].tags.filter(
      (tag) => tag.id !== tagName
    );
  }

  taskChangeDescr(taskId: number, newDescr: string): void {
    this.tasks[taskId].description = newDescr;
  }

  taskMarkCompleted(taskId: number): void {
    this.tasks[taskId].completed = true;
  }

  taskUnMarkCompleted(taskId: number): void {
    this.tasks[taskId].completed = false;
  }

  taskMarkDeleted(taskId: number): void {
    this.tasks[taskId].deleted = true;
  }

  taskUnMarkDeleted(taskId: number): void {
    this.tasks[taskId].deleted = false;
  }
}
