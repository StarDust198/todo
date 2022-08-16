import { ITag } from './Tag';

export interface ITask {
  id: number;
  date?: Date | null;
  time?: boolean;
  title: string;
  description?: string;
  completed?: boolean;
  deleted?: boolean;
  tags?: ITag[];
  timeMatches?: boolean;
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

  changeTitle(newTitle: string): void {
    this.title = newTitle;
  }

  changeDate(newDate: Date): void {
    this.date = newDate;
  }

  addTag(newTag: ITag): void {
    if (!this.tags.some((tag) => tag === newTag))
      this.tags = [...this.tags, newTag];
  }

  removeTag(tagName: string): void {
    this.tags = this.tags.filter((tag) => tag.id !== tagName);
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
