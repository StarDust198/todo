import { Tag } from './Tag';

export class Task {
  readonly id: number;
  date: Date;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  tags: String[];

  constructor(
    title: string,
    date: string,
    completed: boolean = false,
    deleted: boolean = false,
    tags: String[] = []
  ) {
    this.id = new Date().getTime();
    this.date = new Date(date);
    this.title = title;
    this.tags = [...tags];
    this.completed = completed;
    this.deleted = deleted;
    this.description = '';
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
