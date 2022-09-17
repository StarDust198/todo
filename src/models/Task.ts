import { Filters } from './Filters';

export interface ITask {
  id: string;
  date?: string;
  time?: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted?: boolean;
  tags: string[];
  timeMatches?: boolean;
}

export class Task implements ITask {
  readonly id: string;
  date: string;
  time: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  tags: string[];
  timeMatches: boolean;

  constructor({
    title,
    id = '',
    tags = [],
    date = '',
    time = false,
    description = '',
    completed = false,
    deleted = false,
  }: {
    title: string;
    id?: string;
    tags?: string[];
    date?: string;
    time?: boolean;
    description?: string;
    completed?: boolean;
    deleted?: boolean;
  }) {
    this.id = id ? id : new Date().getTime().toString();
    this.date = time ? this.adjustDate(date) : date;
    this.time = time;

    [this.title, this.tags] = this.parseTitle(title);
    this.tags.push(...tags);

    this.completed = completed;
    this.deleted = deleted;
    this.description = description;
    this.timeMatches = true;
  }

  // function splitting string into title and tags
  private parseTitle(str: string): [string, string[]] {
    const inputArr = str.split('#');
    let taskTitle = inputArr[0];

    const tagsArr = inputArr.slice(1);
    tagsArr.forEach((item, i) => {
      const spaceStart = item.indexOf(' ');
      if (spaceStart !== -1) {
        taskTitle += item.slice(spaceStart);
        tagsArr[i] = item.slice(0, spaceStart);
      }
    });

    return [taskTitle.trim().replace(/\s{2,}/gm, ` `), tagsArr];
  }

  private adjustDate(date: string): string {
    return new Date(
      new Date(new Date(new Date(date).setHours(23)).setMinutes(59)).setSeconds(
        59
      )
    ).toISOString();
  }

  static checkDate(task: ITask, filter: Filters): boolean {
    if (!task.date) return true;
    const date = new Date(task.date);
    switch (filter) {
      case Filters.TODAY:
        return date.getDate() === new Date().getDate();
      case Filters.WEEK:
        const dayStart = new Date(
          new Date(new Date().setHours(0)).setMinutes(0)
        );
        return date.getTime() < dayStart.setDate(dayStart.getDate() + 7);
      default:
        return true;
    }
  }
}
