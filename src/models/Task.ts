import { ITag } from './Tag';

export interface ITask {
  id: number;
  date?: Date | null;
  time?: boolean;
  title: string;
  description?: string;
  completed?: boolean;
  deleted?: boolean;
  tags: ITag[];
  timeMatches?: boolean;
}

export class Task implements ITask {
  readonly id: number;
  date: Date | null;
  time: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  tags: ITag[];
  timeMatches: boolean;

  constructor(
    title: string,
    date: string | undefined = undefined,
    time: boolean = false,
    completed: boolean = false,
    deleted: boolean = false,
    tags: ITag[] = [],
    timeMatches: boolean = true
  ) {
    this.id = new Date().getTime();
    this.date = date ? new Date(date) : null;
    this.time = time;
    this.title = title;
    this.tags = [...tags];
    this.completed = completed;
    this.deleted = deleted;
    this.description = '';
    this.timeMatches = timeMatches;
  }
}
