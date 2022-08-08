import { ITag } from './Tag';

export interface ITask {
  id: number;
  date?: Date;
  time?: boolean;
  title: string;
  description?: string;
  completed: boolean;
  deleted?: boolean;
  tags: string[];
  timeMatches: boolean;
}

// interface ITask {
//   title: string;
//   tags: string[];
//   id: number;
//   completed: boolean;
//   timeMatches: boolean;
// }

export class Task implements ITask {
  readonly id: number;
  date: Date;
  time: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  tags: string[];
  timeMatches: boolean;

  constructor(
    title: string,
    date: string,
    time: boolean = false,
    completed: boolean = false,
    deleted: boolean = false,
    tags: string[] = [],
    timeMatches: boolean = true
  ) {
    this.id = new Date().getTime();
    this.date = new Date(date);
    this.time = time;
    this.title = title;
    this.tags = [...tags];
    this.completed = completed;
    this.deleted = deleted;
    this.description = '';
    this.timeMatches = timeMatches;
  }

  changeTitle(newTitle: string): void {
    this.title = newTitle;
  }

  changeDate(newDate: Date): void {
    this.date = newDate;
  }

  addTag(newTag: string): void {
    if (!this.tags.some((tag) => tag === newTag))
      this.tags = [...this.tags, newTag];
  }

  removeTag(tagName: string): void {
    this.tags = this.tags.filter((tag) => tag !== tagName);
  }

  addDescription(newDescr: string): void {
    this.description = newDescr;
  }

  markCompleted(): void {
    this.completed = true;
  }

  unMarkCompleted(): void {
    this.completed = false;
  }

  markDeleted(): void {
    this.deleted = true;
  }

  unMarkDeleted(): void {
    this.deleted = false;
  }
}
